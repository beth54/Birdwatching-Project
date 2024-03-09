from pydantic import BaseModel


class Todo(BaseModel):
    id: int
    title: str
    description: str
    location: str
    family: str
    #img: str




class TodoRequest(BaseModel):
    title: str
    description: str
    location:str
    family: str
    #img: str


