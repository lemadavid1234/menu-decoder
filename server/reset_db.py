from app import models
from app.database import Base, engine

#a reset database script, ran manually (from /server path): python reset_db.py


#drop_all already knows about the foreign key and drops specials before menu (since specials has a fk to menu)
Base.metadata.drop_all(engine)

#recreate all tables
# warning ! --> will delete all existing data
Base.metadata.create_all(engine)

