from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from datetime import date

from typing import Optional, List

class Menu(Base):
    __tablename__ = "menus"

    id: Mapped[int] = mapped_column(primary_key=True)
    day: Mapped[Optional[date]] = mapped_column() #so we can sort by date, is nullable because of schema
    specials: Mapped[List["Special"]] = relationship(order_by="Special.position")



class Special(Base):
    __tablename__ = "specials"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    sentence: Mapped[str] = mapped_column()

    position: Mapped[int] #when returned the Menu object as JSON, we need to maintain order
    price: Mapped[Optional[str]]  #price is str, in case value is 'MP' 

    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id")) 





    