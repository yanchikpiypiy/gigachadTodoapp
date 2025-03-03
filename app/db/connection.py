from app.core.config import settings

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
engine = create_engine(
    settings.DATABASE_URL_psycopg,
    echo=True,
    pool_size = 40,
    max_overflow=40
)

SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
