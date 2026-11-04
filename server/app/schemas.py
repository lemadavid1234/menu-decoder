from pydantic import BaseModel # for Pydantic to validate fields and structure
from typing import List
from datetime import date
from pydantic import ConfigDict, Field

#pydantic models aka contracts or schemas

class Special(BaseModel):
    sentence: str
    price: str | None = None
    model_config = ConfigDict(from_attributes=True)


class Menu(BaseModel):
    specials: List[Special]
    day: date
    concerns: str | None = None
    is_special: bool

# input for claude llm
class ConfirmedMenu(BaseModel):
    specials: List[Special]
    day: date

    #model_config is a setting that Pydantic reads from classes that inherit from Basemodel
    model_config = ConfigDict(from_attributes=True)


class ExplanationFields(BaseModel):
    # sentence: str             # Claude will rewrite sentence & price if passed this model to output schema
    # price: str | None = None  # therefore, create two separate pydantic models
    position: int # to save the positioning and easily match (keeping specials in order)
    possible_ingredients: List[str]
    dietary_restrictions: List[str] = Field(default_factory=list)
    allergens: List[str]
    suggested_wine_pairing: List[str] = Field(default_factory=list)
    description: str
    origin: str | None = None
    pronunciation: str

#output_format for claude llm
class ExplanationFieldsList(BaseModel):
    specials: List[ExplanationFields]


class ExplainedSpecial(ExplanationFields):
    sentence: str
    price: str | None = None

#final output we need
class ExplainedMenu(BaseModel):
    #list of explained specials?
    specials: List[ExplainedSpecial]
    day: date
