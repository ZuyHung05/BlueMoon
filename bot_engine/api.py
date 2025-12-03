from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

from .agent import agent  
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],       
)

@app.post("/stream")
async def stream_chat(request: dict):
    question = request["message"]   

    async def generate():

        for step in agent.stream(
            {"messages": [{"role": "user", "content": question}]},
            stream_mode="values",
        ):
            msg = step["messages"][-1]

            if (
                msg.type == "ai"
                and msg.content
                and msg.additional_kwargs == {}     # no reasoning
                and not getattr(msg, "tool_calls", None)
            ):
                yield msg.content  # ONLY final response

    return StreamingResponse(generate(), media_type="text/plain")

# To run: uvicorn bot_engine.api:app --host 0.0.0.0 --port 8000
