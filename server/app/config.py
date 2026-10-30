from dotenv import load_dotenv
from pathlib import Path
import os

# print("this is my path", str(Path(__file__).parent.parent.parent / ".env"))
load_dotenv(Path(__file__).parent.parent.parent / ".env")




# os.environ, not os.env. 
# - os.environ["DATABASE_URL"] raises an error (KeyError) if the variable is missing, 
# - while os.getenv("DATABASE_URL") returns None.
# - ensures app fails fast during startup if misconfigured

ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]

POSTGRES_USER = os.environ["POSTGRES_USER"]
POSTGRES_PASSWORD = os.environ["POSTGRES_PASSWORD"]
POSTGRES_DB = os.environ["POSTGRES_DB"]
DB_HOST_PORT = os.environ["DB_HOST_PORT"]

# connection string SQLAlchemy needs to reach Postgres (dialect+driver://user:pass@host:port/dbname)
CONNECTION_URL = f"postgresql+psycopg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{DB_HOST_PORT}/{POSTGRES_DB}"
