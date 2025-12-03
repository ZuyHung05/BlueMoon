from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from .agent import agent  # your existing agent
import json

app = FastAPI()

# To run: uvicorn bot_engine.api:app --host 0.0.0.0 --port 8000

@app.post("/stream")
async def stream_chat(request: dict):
    question = request["message"]   

    async def generate():
        # Stream agent output internally
        for step in agent.stream(
            {"messages": [{"role": "user", "content": question}]},
            stream_mode="values",
        ):
            msg = step["messages"][-1]

            # Stream only final AI output chunks
            if (
                msg.type == "ai"
                and msg.content
                and msg.additional_kwargs == {}     # no reasoning
                and not getattr(msg, "tool_calls", None)
            ):
                yield msg.content  # ONLY final response

    return StreamingResponse(generate(), media_type="text/plain")