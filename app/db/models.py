from sqlalchemy.orm import declarative_base, mapped_column, Mapped, relationship
from sqlalchemy import Column, DateTime, String, Integer, Boolean, ForeignKey
from datetime import datetime
from app.db.connection import engine
from typing import Optional
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import uuid
Base = declarative_base()

class TimeStampsMixins(object):
    created_at: Mapped[datetime] = mapped_column(DateTime,default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Users(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    email: Mapped[str] = mapped_column(unique=True)
    username: Mapped[str]
    password: Mapped[str]
    todos: Mapped[list["Todo"]] = relationship("Todo", back_populates="user",  cascade="all, delete-orphan")


class Todo(Base,TimeStampsMixins):
    __tablename__ = "Todos"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    short_desc: Mapped[str] = mapped_column(String, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    user: Mapped[Users] = relationship("Users", back_populates="todos")
    reminder_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    task_id: Mapped[Optional[str]]
class Startup():
    def startup():
        engine.echo = False
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        engine.echo = True
