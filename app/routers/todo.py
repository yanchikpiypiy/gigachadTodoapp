from sqlalchemy.orm import Session
from app.db import models
from app.schemas.Users import UsersDTO,Token,TodoDTO
from app.db.connection import get_db, SessionLocal
from app.core.config import settings
from app.routers import auth
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from app import celery_worker
from celery.result import AsyncResult
from uuid import UUID
router = APIRouter(
    prefix='/todo',
    tags=['todo']
)
@router.post("",response_model=TodoDTO,description="Create new todo task")
def create_todo(Todo: TodoDTO ,db: Session = Depends(get_db), user_dp: dict = Depends(auth.get_current_user)):
    
    # task = celery_worker.create_task.delay(1,4,6)
    to_email = "yanchervonyy@gmail.com"
    subject = f"Todo Reminder: Make sure to finish your todos today looser"
    message_body = f"Reminder for your todo task: {Todo.short_desc}"
    
    # Schedule the task.
    task = celery_worker.create_task.apply_async(
        args=[1, 4, 6, to_email, subject, message_body],
        eta=Todo.reminder_time  # Schedules the task to run at reminder_time.
    )

    new_obj = models.Todo(**Todo.model_dump(), user_id=user_dp["id"], task_id=task.id)
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return new_obj

@router.get("/todos", description="Get list of todos")
def get_todos(db:Session = Depends(get_db), user_dp: dict = Depends(auth.get_current_user)):
    Todos = db.query(models.Todo).filter(models.Todo.user_id == user_dp["id"]).all()

    return Todos

@router.delete("/{todo_id}", description="Remove todo task")
def remove_todo(todo_id: int,db:Session = Depends(get_db)):
    todo_item = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    db.delete(todo_item)
    db.commit()
    return {"Todo removed"}

@router.get("/task-status/{task_id}")
def task_status(task_id: str):
    
    result = AsyncResult(task_id, app=celery_worker.celery)
    

    if not result.ready():
        return "is still running"
    

    if result.successful():
        return result.get()
    else:
        return "Task failed"
    
@router.delete("/tasks/{task_id}", description="Delete a scheduled task")
def  delete_task(task_id: str):
    celery_worker.celery.control.revoke(task_id, terminate=True)
    return {"message": "Task revoked successfully", "task_id": task_id}