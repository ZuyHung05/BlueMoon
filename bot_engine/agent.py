import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import create_agent
from .utils import read_json, read_txt

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DB_URI = os.getenv("DB_URI")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.0-flash")  

os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

model = ChatGoogleGenerativeAI(model=MODEL_NAME)

db = SQLDatabase.from_uri(DB_URI)
toolkit = SQLDatabaseToolkit(db=db, llm=model)
tools = toolkit.get_tools()

agent = create_agent(
    model,
    tools,
    system_prompt=read_txt("bot_engine/prompts/db_query_prompt.txt"),
)

def stream_db_answer(question: str):
    for step in agent.stream(
        {"messages": [{"role": "user", "content": question}]},
        stream_mode="values",
    ):
        msg = step["messages"][-1]
        print(f"Check msg: {msg}")
        
        if (
            msg.type == "ai"
            and msg.content
            and msg.additional_kwargs == {}
            and not getattr(msg, "tool_calls", None)
        ):
            yield msg.content


def get_final_db_answer(question: str) -> str:
    result = agent.invoke(
        {"messages": [{"role": "user", "content": question}]}
    )
    return result["messages"][-1].content


if __name__ == "__main__":
    test_question = "Which household on average has the longest fee?"

    print("=== Testing stream_db_answer(question) ===")
    print("Streaming response:  ")
    for token in stream_db_answer(test_question):
        print(token, end="", flush=True)

    print("\n\n=== Testing get_final_db_answer(question) ===")
    final_answer = get_final_db_answer(test_question)
    print("Final answer:", final_answer)