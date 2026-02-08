# 自动化行业研究系统

本项目提供一个 FastAPI 后端与 Vite 前端的可运行模板，用于展示自动化行业研究的基础流程。

## 功能概览

- `GET /api/health`：健康检查
- `GET /api/research?topic=...`：生成研究摘要与详细报告
- 前端 UI 提供健康检查与研究请求入口

## 本地运行

### 1. 启动后端

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows 使用 .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

访问：`http://localhost:8000/api/health`

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问：`http://localhost:5173`

如果你不想使用 Vite 代理（例如前后端在不同端口/机器上），可以创建 `.env.local` 并设置 API 基础地址：

```bash
VITE_API_BASE=http://localhost:8000
```

## Docker 运行

```bash
docker compose up --build
```

- 前端：`http://localhost:5173`
- 后端：`http://localhost:8000/api/health`

## 注意事项

- Vite 已配置 `/api` 代理到 `http://localhost:8000`。
- 若遇到 npm 403，可切换镜像源：

```bash
npm config set registry https://registry.npmmirror.com
```

### Windows: git 命令被同名文件夹遮挡

如果 `where git` 显示类似 `C:\Users\你的用户名\TEST\git` 的路径，说明当前项目里有一个名为 `git` 的文件夹，导致系统优先把它当成命令而不是使用真正的 `git.exe`。这会让 `git` 命令异常或无法运行。

解决方法：

1. 确认当前目录是否存在 `git` 文件夹并删除或重命名（例如改为 `git-cache`）。
2. 再运行 `where git`，确保只剩下类似 `D:\Program Files\Git\cmd\git.exe` 的路径。
