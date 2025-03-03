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

    class Config:
        env_file = ".env"
    
    @property
    def DATABASE_URL_psycopg(self):
        return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()

