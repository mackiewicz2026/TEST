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
    headline = f"{topic} 自动化行业研究报告"
    highlights = [
        "自动化应用在生产、物流与服务场景持续渗透，驱动效率与成本优化。",
        "头部企业以平台化与生态合作方式扩大产业影响力。",
        "供应链与人才结构成为短期瓶颈，长期增长仍取决于技术迭代。",
    ]
    sections = {
        "市场概况": (
            f"{topic} 自动化市场处于从试点向规模化落地的过渡期，"
            "需求集中在流程优化、质量控制与风险预警等场景。"
        ),
        "增长驱动": "政策支持、行业数字化升级和成本压力是主要驱动因素。",
        "技术趋势": "智能感知、流程编排与行业大模型正在加速融合，推动端到端自动化。",
        "竞争格局": "大型供应商提供全栈方案，中小企业聚焦细分场景与交付能力。",
        "风险与挑战": "数据孤岛、合规约束与人才缺口限制了大规模复制。",
        "策略建议": "优先选择高价值场景试点，建立数据治理体系并强化跨部门协作。",
    }
    report_lines = [
        headline,
        "",
        "核心要点：",
        *[f"- {item}" for item in highlights],
        "",
        *[f"{title}：{detail}" for title, detail in sections.items()],
    ]
    return {
        "topic": topic,
        "summary": f"{topic} 行业正进入自动化规模化落地阶段，企业关注效率与质量提升。",
        "highlights": highlights,
        "sections": sections,
        "report": "\n".join(report_lines),
        "sources": [
            "https://example.com/report-1",
            "https://example.com/report-2",
            "https://example.com/report-3",
        ],
    }
