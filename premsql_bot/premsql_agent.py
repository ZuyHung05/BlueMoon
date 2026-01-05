import os
import torch
from dotenv import load_dotenv
from premsql.generators import Text2SQLGeneratorHF
from premsql.executors import ExecutorUsingLangChain

load_dotenv()

DB_URI = os.getenv("DB_URI")
MODEL_NAME = os.getenv("PREMSQL_MODEL", "premai-io/prem-1B-SQL")

if torch.cuda.is_available():
    default_device = "cuda"
else:
    default_device = "cpu"

DEVICE = os.getenv("PREMSQL_DEVICE", default_device)

print(f"Using device: {DEVICE}")
if "cuda" in DEVICE and not torch.cuda.is_available():
    print("WARNING: CUDA duoc cau hinh nhung PyTorch khong tim thay GPU. Chuyen ve CPU.")
    DEVICE = "cpu"

# Khoi tao generator voi model local
text2sql_generator = Text2SQLGeneratorHF(
    model_or_name_or_path=MODEL_NAME,
    experiment_name="bluemoon_chatbot",
    device=DEVICE,
    type="test"
)

# Executor cho PostgreSQL
executor = ExecutorUsingLangChain()


def get_database_schema(db_uri: str) -> str:
    """Lay schema cua database de tao prompt."""
    from langchain_community.utilities import SQLDatabase
    
    db = SQLDatabase.from_uri(db_uri)
    return db.get_table_info()


def create_prompt(question: str, schema: str) -> str:
    """Tao prompt theo format cua prem-1B-SQL voi context tieng Viet."""
    
    # Mo ta database bang tieng Anh de model hieu
    database_context = """
### Database Context (Vietnamese Apartment Management System - BlueMoon)
This database manages an apartment building in Vietnam. Key terminology:
- "ho gia dinh" (household) = a family unit living in an apartment
- "cu dan" (resident) = a person living in the building  
- "can ho" (apartment) = an apartment unit
- "xe" (vehicle) = car or motorbike owned by households
- "phi" (fee) = monthly fees that households need to pay
- "tang ham" (basement floor) = underground parking floor

### Table Descriptions:
- household: Contains household information. Each household lives in one apartment.
  - household_id: Primary key
  - apartment_id: Foreign key to apartment
  - head_of_household: ID of the household head (resident_id from residents table)
  - status: Active status
  - start_day: Move-in date

- residents: Contains information about people living in the building.
  - resident_id: Primary key
  - household_id: Foreign key to household
  - full_name: Full name of the resident
  - family_role: Role in family (Father, Mother, Son, Daughter, etc.)
  - gender: M or F
  - date_of_birth, id_number, phone_number, job

- apartment: Contains apartment unit information.
  - apartment_id: Primary key
  - room_number: Room number
  - area: Size in square meters
  - floor: Floor number

- vehicle: Contains vehicles owned by households.
  - vehicle_id: Primary key
  - household_id: Foreign key to household
  - plate_number: License plate
  - type: 'car' or 'bike'
  - basement_floor: Parking floor number
  - location: Parking spot location

- fees: Monthly fees for households.
- payment_period: Fee payment periods.
- pay: Payment records.
"""

    # Vi du cac cau hoi va SQL (few-shot examples) - TIENG VIET
    examples = """
### Examples:
Q: Co bao nhieu ho gia dinh?
SQL: SELECT COUNT(*) FROM household;

Q: Co bao nhieu cu dan?
SQL: SELECT COUNT(*) FROM residents;

Q: Liet ke cac xe o tang ham 1
SQL: SELECT * FROM vehicle WHERE basement_floor = 1;

Q: Co bao nhieu xe o to?
SQL: SELECT COUNT(*) FROM vehicle WHERE type = 'car';

Q: Co bao nhieu xe may?
SQL: SELECT COUNT(*) FROM vehicle WHERE type = 'bike';

Q: Liet ke tat ca cu dan
SQL: SELECT * FROM residents;

Q: Liet ke tat ca xe
SQL: SELECT * FROM vehicle;

Q: Cac ho gia dinh ma co ca xe may va o to
SQL: SELECT r.full_name, r.phone_number FROM residents r JOIN household h ON r.resident_id = h.head_of_household WHERE h.household_id IN (SELECT household_id FROM vehicle WHERE type = 'car') AND h.household_id IN (SELECT household_id FROM vehicle WHERE type = 'bike');

Q: Tim cac ho co nhieu hon 4 thanh vien
SQL: SELECT r.full_name, COUNT(res.resident_id) as member_count FROM household h JOIN residents r ON h.head_of_household = r.resident_id JOIN residents res ON h.household_id = res.household_id GROUP BY h.household_id, r.full_name HAVING COUNT(res.resident_id) > 4;

Q: Ai la chu ho cua can ho co dien tich lon nhat
SQL: SELECT r.full_name, a.area FROM residents r JOIN household h ON r.resident_id = h.head_of_household JOIN apartment a ON h.apartment_id = a.apartment_id ORDER BY a.area DESC LIMIT 1;

Q: Liet ke cac ho co xe may nhung khong co o to
SQL: SELECT r.full_name FROM residents r JOIN household h ON r.resident_id = h.head_of_household WHERE h.household_id IN (SELECT household_id FROM vehicle WHERE type = 'bike') AND h.household_id NOT IN (SELECT household_id FROM vehicle WHERE type = 'car');

Q: Co bao nhieu can ho?
SQL: SELECT COUNT(*) FROM apartment;

Q: Liet ke cac xe cua ho gia dinh 1
SQL: SELECT * FROM vehicle WHERE household_id = 1;

Q: Cu dan nao song o can ho 101?
SQL: SELECT r.* FROM residents r JOIN household h ON r.household_id = h.household_id JOIN apartment a ON h.apartment_id = a.apartment_id WHERE a.room_number = 101;

Q: Co bao nhieu cu dan tren 70 tuoi?
SQL: SELECT COUNT(*) FROM residents WHERE EXTRACT(YEAR FROM AGE(date_of_birth)) > 70;

Q: Liet ke cac cu dan duoi 18 tuoi
SQL: SELECT * FROM residents WHERE EXTRACT(YEAR FROM AGE(date_of_birth)) < 18;

Q: Liet ke cac cu dan sinh nam 1990
SQL: SELECT * FROM residents WHERE EXTRACT(YEAR FROM date_of_birth) = 1990;

Q: Ho gia dinh nao co xe o to?
SQL: SELECT r.full_name FROM residents r JOIN household h ON r.resident_id = h.head_of_household WHERE h.household_id IN (SELECT household_id FROM vehicle WHERE type = 'car');

Q: Ho gia dinh nao co nhieu hon 3 thanh vien?
SQL: SELECT r.full_name FROM household h JOIN residents r ON h.head_of_household = r.resident_id JOIN residents res ON h.household_id = res.household_id GROUP BY h.household_id, r.full_name HAVING COUNT(res.resident_id) > 3;

Q: Ho gia dinh nao chua dong phi thang 12?
SQL: SELECT r.full_name FROM residents r JOIN household h ON r.resident_id = h.head_of_household WHERE h.household_id NOT IN (SELECT household_id FROM pay WHERE EXTRACT(MONTH FROM payment_date) = 12);

Q: Ho gia dinh nao song o tang 5?
SQL: SELECT r.full_name FROM residents r JOIN household h ON r.resident_id = h.head_of_household JOIN apartment a ON h.apartment_id = a.apartment_id WHERE a.floor = 5;


Q: Ho gia dinh nao co xe may?
SQL: SELECT r.full_name FROM residents r JOIN household h ON r.resident_id = h.head_of_household WHERE h.household_id IN (SELECT household_id FROM vehicle WHERE type = 'bike');

Q: Có bao nhiêu hộ gia đình có cả ô tô và xe máy?
SQL: SELECT COUNT(*) FROM household WHERE household_id IN (SELECT household_id FROM vehicle WHERE type = 'car') AND household_id IN (SELECT household_id FROM vehicle WHERE type = 'bike');

"""

    prompt = f"""### Instructions:
- Always use standard PostgreSQL syntax.
- Use `EXTRACT(YEAR FROM AGE(date_of_birth))` to calculate age.
- Do NOT hardcode dates for age calculations (like '1970-01-01').
- Use `head_of_household` to join with `residents.resident_id` when searching for household heads.
- When asked 'Which household' or 'Which resident' (Hộ gia đình nào / Cư dân nào), ALWAYS select the 'full_name' of the resident or household head. NEVER select the ID.
- Return ONLY the SQL query, no explanations.
- Priority return name instead of ID.
{database_context}
{examples}
### Database Schema
{schema}

### Question
{question}

### SQL Query
"""
    return prompt


def generate_sql(question: str, db_uri: str = None) -> str:
    """
    Sinh cau lenh SQL tu cau hoi tu nhien.
    """
    if db_uri is None:
        db_uri = DB_URI
        
    # Lay schema tu database
    schema = get_database_schema(db_uri)
    
    # Tao prompt
    prompt = create_prompt(question, schema)
    
    # Generate SQL tu prompt
    response = text2sql_generator.generate(
        data_blob={"prompt": prompt},
        temperature=0.1,
        max_new_tokens=256
    )
    
    # Extract SQL tu response
    if isinstance(response, dict):
        generated_sql = response.get("generated", response.get("sql", str(response)))
    else:
        generated_sql = str(response)
    
    # Clean SQL
    generated_sql = generated_sql.strip()
    if generated_sql.startswith("```sql"):
        generated_sql = generated_sql[6:]
    if generated_sql.startswith("```"):
        generated_sql = generated_sql[3:]
    if generated_sql.endswith("```"):
        generated_sql = generated_sql[:-3]
    return generated_sql.strip()


def get_sql_answer(question: str, db_uri: str = None) -> dict:
    """
    Chuyen cau hoi ngon ngu tu nhien thanh SQL va thuc thi.
    """
    if db_uri is None:
        db_uri = DB_URI
    
    try:
        # Sinh SQL
        generated_sql = generate_sql(question, db_uri)
        
        # Execute SQL
        execution_result = executor.execute_sql(
            sql=generated_sql,
            dsn_or_db_path=db_uri
        )
        
        result_content = execution_result.get("result")
        
        # Neu ket qua rong (list rong, string rong, hoac None) va khong phai la so 0
        if not result_content and result_content != 0:
            result_content = "Không có"
            
        return {
            "question": question,
            "generated_sql": generated_sql,
            "result": result_content,
            "error": execution_result.get("error")
        }
        
    except Exception as e:
        return {
            "question": question,
            "generated_sql": None,
            "result": None,
            "error": str(e)
        }


if __name__ == "__main__":
    test_question = "Có bao nhiêu hộ gia đình có cả ô tô và xe máy?"
    
    print(f"Question: {test_question}")
    result = get_sql_answer(test_question)
    
    print(f"Generated SQL: {result['generated_sql']}")
    print(f"Result: {result['result']}")
    if result['error']:
        print(f"Error: {result['error']}")
