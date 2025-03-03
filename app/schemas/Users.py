from pydantic import BaseModel
from app.schemas.Todo import TodoDTO
class UsersDTO(BaseModel):
    email: str
    username: str
    password: str


class UsersRelDTO(UsersDTO):
    todos: list["TodoDTO"]

class Token(BaseModel):
    access_token: str
    token_type: str