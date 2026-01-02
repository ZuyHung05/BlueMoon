from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .premsql_agent import get_sql_answer

app = FastAPI(title="BlueMoon PremSQL Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat(request: ChatRequest):
    """Non-streaming endpoint cho chatbot."""
    try:
        result = get_sql_answer(request.message)
        
        if result["error"]:
            return JSONResponse(
                status_code=400,
                content={"error": result["error"], "sql": result["generated_sql"]}
            )
        
        # Debug: in ra kieu du lieu
        raw = result["result"]
        print(f"DEBUG - Raw result type: {type(raw)}, value: {raw}")
        
        formatted = format_result(raw)
        print(f"DEBUG - Formatted result: {formatted}")
        
        return {
            "answer": formatted,
            "sql": result["generated_sql"],
            "raw_result": raw
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


import json
from .premsql_agent import get_sql_answer, generate_sql, executor, DB_URI

@app.post("/stream")
async def stream_chat(request: ChatRequest):
    """Streaming endpoint cho chatbot (JSON per line)."""
    async def generate():
        try:
            # Step 1: Generate SQL
            generated_sql = generate_sql(request.message)
            yield json.dumps({"type": "sql", "content": generated_sql}) + "\n"
            
            # Step 2: Execute SQL
            execution_result = executor.execute_sql(
                sql=generated_sql,
                dsn_or_db_path=DB_URI
            )
            
            if execution_result.get("error"):
                yield json.dumps({"type": "error", "content": execution_result["error"]}) + "\n"
            else:
                formatted = format_result(execution_result["result"])
                yield json.dumps({"type": "answer", "content": formatted, "raw": execution_result["result"]}) + "\n"
                
        except Exception as e:
            yield json.dumps({"type": "error", "content": str(e)}) + "\n"
    
    return StreamingResponse(generate(), media_type="application/x-ndjson")


def format_result(result) -> str:
    """Format ket qua SQL thanh text de doc - khong co dau ngoac thua."""
    if result is None:
        return "Khong tim thay du lieu."
    
    # Xu ly chuoi dang "[(value,)]" hoac "[(...)]"
    if isinstance(result, str):
        result = result.strip()
        # Neu la string dang "[(81,)]" -> convert ve list
        if result.startswith("[") and result.endswith("]"):
            try:
                import ast
                result = ast.literal_eval(result)
            except:
                # Neu khong parse duoc, tra ve text thong thuong
                return result.strip("[](),'\" ")
        else:
            return result
    
    # Xu ly danh sach
    if isinstance(result, (list, tuple)):
        if len(result) == 0:
            return "Khong tim thay du lieu."
        
        # Neu chi co 1 phan tu
        if len(result) == 1:
            item = result[0]
            # Neu phan tu do cung la tuple/list voi 1 gia tri
            if isinstance(item, (list, tuple)) and len(item) == 1:
                return str(item[0])
            elif isinstance(item, (list, tuple)):
                return " | ".join(str(val) for val in item)
            else:
                return str(item)
        
        # Neu co nhieu phan tu
        formatted_rows = []
        for row in result:
            if isinstance(row, (list, tuple)):
                if len(row) == 1:
                    formatted_rows.append(str(row[0]))
                else:
                    formatted_rows.append(" | ".join(str(val) for val in row))
            else:
                formatted_rows.append(str(row))
        
        return "\n".join(formatted_rows)
    
    return str(result)
