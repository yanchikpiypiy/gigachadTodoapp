from pydantic import BaseModel
from datetime import datetime
class TodoDTO(BaseModel):
    short_desc: str
