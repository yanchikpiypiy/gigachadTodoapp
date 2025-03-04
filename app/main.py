import sys, uvicorn
import os
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from fastapi import FastAPI, Depends
# from app.db.connection import get_db
# from sqlalchemy.orm import Session
# from app.db import models
# from app.db.connection import settings, SessionLocal
# from app.schemas.Todo import TodoDTO
from app.db.models import Startup
from app.routers import auth, todo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
app.include_router(todo.router)
origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "http://frontend:3000",    
    "http://web:8000"         
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Startup.startup()
auth.populate_db()


if __name__ == "__main__":
    if "--webserver" in sys.argv:
        uvicorn.run("app.main:app", reload=True, host="127.0.0.1", port=8000)


