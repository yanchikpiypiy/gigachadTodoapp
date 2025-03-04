from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class TodoDTO(BaseModel):
    short_desc: str
    reminder_time: Optional[datetime]
