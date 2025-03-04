import sys, uvicorn
import os
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from fastapi import FastAPI, Depends
from app.db.connection import get_db
from sqlalchemy.orm import Session
from app.db import models
from app.db.connection import settings
from app.schemas.Todo import TodoDTO
from app.db.models import Startup
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
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
@app.post("/",response_model=TodoDTO,description="Create new todo task")
def create_todo(Todo: TodoDTO ,db: Session = Depends(get_db), user_dp: dict = Depends(auth.get_current_user)):
    new_obj = models.Todo(**Todo.model_dump(), user_id=user_dp["id"])
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return new_obj

@app.get("/todos", description="Get list of todos")
def get_todos(db:Session = Depends(get_db), user_dp: dict = Depends(auth.get_current_user)):
    Todos = db.query(models.Todo).filter(models.Todo.user_id == user_dp["id"]).all()
    return Todos

@app.delete("/todo/{todo_id}", description="Remove todo task")
def remove_todo(todo_id: int,db:Session = Depends(get_db)):
    todo_item = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    db.delete(todo_item)
    db.commit()
    return {"Todo removed"}



if __name__ == "__main__":
    if "--webserver" in sys.argv:
        uvicorn.run("app.main:app", reload=True, host="0.0.0.0", port=8000)


