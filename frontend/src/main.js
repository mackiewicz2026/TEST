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
      <div class="report">
        <h3>完整报告</h3>
        <pre id="reportContent">等待研究结果...</pre>
      </div>
    </section>
  </main>
`;

const healthBtn = document.querySelector("#healthBtn");
const researchBtn = document.querySelector("#researchBtn");
const healthResult = document.querySelector("#healthResult");
const reportContent = document.querySelector("#reportContent");
const topicInput = document.querySelector("#topicInput");

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `请求失败 (${response.status})`);
  }
  return response.json();
};

const formatReport = (data) => {
  if (!data || typeof data !== "object") {
    return "未返回完整报告。";
  }
  if (data.report) {
    return data.report;
  }
  const sections = [];
  if (data.summary) {
    sections.push(`摘要:\\n${data.summary}`);
  }
  if (Array.isArray(data.sources) && data.sources.length > 0) {
    sections.push(`来源:\n${data.sources.join("\n")}`);
  }
  return sections.length > 0 ? sections.join("\n\n") : "未返回完整报告。";
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
  reportContent.textContent = "正在生成...";
  try {
    const data = await fetchJson(`/api/research?topic=${encodeURIComponent(topic)}`);
    reportContent.textContent = formatReport(data);
  } catch (error) {
    reportContent.textContent = `请求失败: ${error}`;
  } finally {
    researchBtn.disabled = false;
  }
});
