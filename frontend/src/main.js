import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="container">
    <header>
      <p class="eyebrow">自动化行业研究系统</p>
      <h1>研究助手控制台</h1>
      <p class="subtitle">一键查看后端健康状态并生成行业研究摘要。</p>
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
      <pre id="researchResult">等待研究结果...</pre>
    </section>
  </main>
`;

const healthBtn = document.querySelector("#healthBtn");
const researchBtn = document.querySelector("#researchBtn");
const healthResult = document.querySelector("#healthResult");
const researchResult = document.querySelector("#researchResult");
const topicInput = document.querySelector("#topicInput");

healthBtn.addEventListener("click", async () => {
  healthResult.textContent = "正在请求...";
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    healthResult.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    healthResult.textContent = `请求失败: ${error}`;
  }
});

researchBtn.addEventListener("click", async () => {
  const topic = topicInput.value || "AI 行业";
  researchResult.textContent = "正在生成...";
  try {
    const response = await fetch(`/api/research?topic=${encodeURIComponent(topic)}`);
    const data = await response.json();
    researchResult.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    researchResult.textContent = `请求失败: ${error}`;
  }
});
