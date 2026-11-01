from pydantic import BaseModel # for Pydantic to validate fields and structure
from typing import List
from datetime import date


class Special(BaseModel):
    sentence: str
    price: str | None = None


class Menu(BaseModel):
    specials: List[Special]
    day: date | None
    concerns: str | None = None
    is_special: bool


class ConfirmedMenu(BaseModel):
    specials: List[Special]
    day: date
