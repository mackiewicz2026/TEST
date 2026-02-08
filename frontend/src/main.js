import "./style.css";

const API_BASE = import.meta.env.VITE_API_BASE?.trim() || "";
const app = document.querySelector("#app");

app.innerHTML = `
  <main class="container">
    <header>
      <p class="eyebrow">自动化行业研究系统</p>
      <h1>研究助手控制台</h1>
      <p class="subtitle">一键查看后端健康状态并生成行业研究摘要。</p>
      <p class="meta">当前 API 基础地址：${API_BASE || "使用 /api 代理"}</p>
    </header>
    <section class="panel">
      <h2>运行状态</h2>
      <button id="healthBtn" class="primary">检查 /api/health</button>
      <pre id="healthResult">等待检查...</pre>
    </section>
    <section class="panel">
      <h2>行业研究</h2>
      <label>
        研究主题
        <input id="topicInput" type="text" value="AI 行业" />
      </label>
      <button id="researchBtn" class="primary">获取 /api/research</button>
      <div id="researchResult" class="report">等待研究结果...</div>
    </section>
  </main>
`;

const healthBtn = document.querySelector("#healthBtn");
const researchBtn = document.querySelector("#researchBtn");
const healthResult = document.querySelector("#healthResult");
const researchResult = document.querySelector("#researchResult");
const topicInput = document.querySelector("#topicInput");

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `请求失败 (${response.status})`);
  }
  return response.json();
};

const buildFallbackReport = (data, topic) => {
  const resolvedTopic = data.topic || topic;
  const lines = [`${resolvedTopic} 自动化行业研究报告`];

  if (data.summary) {
    lines.push("", "摘要：", data.summary);
  }

  if (Array.isArray(data.highlights) && data.highlights.length > 0) {
    lines.push("", "核心要点：");
    data.highlights.forEach((item) => lines.push(`- ${item}`));
  }

  if (data.sections && Object.keys(data.sections).length > 0) {
    lines.push("", "详细分析：");
    Object.entries(data.sections).forEach(([title, detail]) => {
      lines.push(`${title}：${detail}`);
    });
  }

  return lines.join("\n");
};

healthBtn.addEventListener("click", async () => {
  healthBtn.disabled = true;
  healthResult.textContent = "正在请求...";
  try {
    const data = await fetchJson("/api/health");
    healthResult.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    healthResult.textContent = `请求失败: ${error}`;
  } finally {
    healthBtn.disabled = false;
  }
});

researchBtn.addEventListener("click", async () => {
  researchBtn.disabled = true;
  const topic = topicInput.value || "AI 行业";
  researchResult.textContent = "正在生成...";
  try {
    const data = await fetchJson(`/api/research?topic=${encodeURIComponent(topic)}`);
    const sections = data.sections
      ? Object.entries(data.sections)
          .map(
            ([title, detail]) => `
              <div class="report-section">
                <h3>${title}</h3>
                <p>${detail}</p>
              </div>
            `,
          )
          .join("")
      : "";
    const fallbackReport = buildFallbackReport(data, topic);
    const reportText = data.report
      ? `<pre class="report-text">${data.report}</pre>`
      : `
        <p class="report-missing">后端未返回完整报告字段（report），已根据摘要自动生成报告内容。</p>
        <pre class="report-text">${fallbackReport}</pre>
      `;
    const highlights = Array.isArray(data.highlights)
      ? `<ul>${data.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : "";
    const sources = Array.isArray(data.sources)
      ? `<ul>${data.sources.map((item) => `<li><a href="${item}" target="_blank" rel="noreferrer">${item}</a></li>`).join("")}</ul>`
      : "";
    researchResult.innerHTML = `
      <h3>${data.topic || topic} 报告摘要</h3>
      <p class="report-summary">${data.summary || "暂无摘要"}</p>
      ${highlights ? `<h4>核心要点</h4>${highlights}` : ""}
      ${sections ? `<h4>详细分析</h4>${sections}` : ""}
      <h4>完整报告</h4>
      ${reportText}
      ${sources ? `<h4>参考来源</h4>${sources}` : ""}
      <details class="report-raw">
        <summary>查看原始 JSON</summary>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </details>
    `;
  } catch (error) {
    researchResult.textContent = `请求失败: ${error}`;
  } finally {
    researchBtn.disabled = false;
  }
});
