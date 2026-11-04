from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import date

from typing import Optional, List

#database models

class Menu(Base):
    __tablename__ = "menus"

    id: Mapped[int] = mapped_column(primary_key=True)
    day: Mapped[date] #so we can sort by date
    specials: Mapped[List["Special"]] = relationship(order_by="Special.position")



class Special(Base):
    __tablename__ = "specials"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    sentence: Mapped[str]

    position: Mapped[int] #when returned the Menu object as JSON, we need to maintain order
    price: Mapped[Optional[str]]  #price is str, in case value is 'MP' 

    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id")) 


    possible_ingredients: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    dietary_restrictions: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String)) 
    allergens: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    suggested_wine_pairing: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String))
    description: Mapped[Optional[str]]
    origin: Mapped[Optional[str]]
    pronunciation: Mapped[Optional[str]]



    