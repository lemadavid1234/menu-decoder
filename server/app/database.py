from app.config import CONNECTION_URL
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, DeclarativeBase


# lazy initialization (Software design pattern), has not actually tried to connect to the database yet,
# happens only the first time it is asked to perform a task against the database
# create_engine.echo parameter instructs Engine to log all of the SQL it emits to a Python logger that we will write to standard out
engine = create_engine(CONNECTION_URL, echo=True)

# parent class for table models
# create new class that subclasses SQLAlchemy DeclarativeBase class
# each subclass of Base + class-level directives = ORM mapped class reffering to a particular Table object
class Base(DeclarativeBase):
    pass


def get_db():

    db = Session(engine)

    try:
        yield db
    finally:
        db.close()

