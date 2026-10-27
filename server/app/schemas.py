from pydantic import BaseModel # for Pydantic to validate fields and structure
from typing import List
from datetime import date


class Special(BaseModel):
    sentence: str
    price: str | None


class Menu(BaseModel):
    specials: List[Special]
    week: date | None
    concerns: str | None
    is_special: bool
