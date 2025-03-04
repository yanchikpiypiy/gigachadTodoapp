from pydantic_settings import BaseSettings, SettingsConfigDict

from dotenv import load_dotenv
load_dotenv()
class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_NAME: str
    SECRET_KEY: str
    DATABASE_URL: str
    CELERY_RESULT_BACKEND: str
    CELERY_BROKER_URL: str
    class Config:
        env_file = ".env"
        extra = "ignore"
    
    @property
    def DATABASE_URL_psycopg(self):
        return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()

