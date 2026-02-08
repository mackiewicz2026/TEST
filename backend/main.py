from datetime import datetime
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Auto Research API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/research")
def research(topic: str = "AI 行业") -> Dict[str, Any]:
    return {
        "topic": topic,
        "summary": f"这是关于 {topic} 的自动化行业研究摘要。",
        "sources": [
            "https://example.com/report-1",
            "https://example.com/report-2",
        ],
    }
