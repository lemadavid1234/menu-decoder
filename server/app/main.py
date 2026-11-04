from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends

from pathlib import Path
import uuid

from app.database import get_db, Session, engine, Base
from app.llm import get_text_from_llm, LLMError, get_explanation_from_llm
# from app.schemas import Menu #note: from app import models, schema --> use models.Menu and schemas.Menu to avoid overwriting each other
from app import models
from app import schemas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

upload_dir = Path("./uploads") #begins where uvicorn was started (/server), therefore uploads go into /server/uploads
upload_dir.mkdir(exist_ok=True)

# once database and models classes are registered, create tables
Base.metadata.create_all(engine)


@app.get("/hello")
def greet():
    return {"message": "Hello World!"}



@app.post('/api/photos')
def create_upload(photo: UploadFile):

    # uploading file with NO filename
    if not photo.filename:
        raise HTTPException(status_code=400, detail='Upload file missing a file name')

    # uploading file with unsupported media type
    if photo.content_type not in ('image/jpeg', 'image/png'):
        raise HTTPException(status_code=415, detail='Image type not supported. Must be .PNG or .JPG')

    # creating unique file_name
    unique_filename = f"{uuid.uuid4()}_{Path(photo.filename).stem}.{photo.content_type.split("/")[-1]}"


    content_bytes = photo.file.read()

    # saves to local disk for manual checking if uploaded file wasn't corrupted and is the same one
    destination = f"{upload_dir}/{unique_filename}"
    with open(destination, "wb") as buffer:
        buffer.write(content_bytes)

    try:
        menu = get_text_from_llm(content_bytes, photo.content_type)

    except LLMError as e:
        raise HTTPException(status_code=502, detail=f"Error is: {e}")



    return {"original": photo.filename, "new_file_name": unique_filename,  "file_size": photo.size, "content_type": photo.content_type, "menu": menu, "successful": True}


@app.post("/api/menus")
def create_menu(confirmed_menu: schemas.ConfirmedMenu, db: Session = Depends(get_db)):

    #pydantic models describe JSON, SQLAlchemy models describe tables
    db_menu = models.Menu(day=confirmed_menu.day)
    for index, s in enumerate(confirmed_menu.specials):
        special = models.Special(sentence=s.sentence, price=s.price, position=index)
        db_menu.specials.append(special) 
    
    #db.add() only accepts SQLAlchemy model instances
    db.add(db_menu)
    db.commit() #postgres assigns id after commit
    db.refresh(db_menu) #reload the db_menu object's columns, so it now has id

    return {"id": db_menu.id}



@app.get("/api/menus/{menu_id}", response_model=schemas.ConfirmedMenu)
def get_menu_by_id(menu_id: int, db: Session = Depends(get_db)):

    #returns SQLAlchemy object, which represents a database row
    db_menu = db.get(models.Menu, menu_id)

    if not db_menu or db_menu.id != menu_id:
        raise HTTPException(status_code=404, detail='Menu not found')
    
    return db_menu



@app.post("/api/menus/{menu_id}/explanation", response_model=schemas.ExplainedMenu)
def create_menu_explanation(menu_id: int, db: Session = Depends(get_db)):

    db_menu = db.get(models.Menu, menu_id)
    if not db_menu:
        raise HTTPException(status_code=404, detail='Menu not found')

    # idempotency check, if menu_id with existing explanation already exists, return Menu
    if db_menu.specials[0].description is not None:
        return db_menu

    #convert menu (database row) into a schemas.ConfirmedMenu
    #ConfigDict allows ConfirmedMenu pydantic model to read off attributes of an object 
    confirmed_menu = schemas.ConfirmedMenu.model_validate(db_menu)

    try:
        explained_specials_list = get_explanation_from_llm(confirmed_menu)
    except LLMError as e:
        raise HTTPException(status_code=502, detail=f"error is {e}")


    #check if explained_specials_list.specials is same length of confirmed_menu.specials
    #also check if explained_specials_list.specials["position"] are in order from 0...n-1
    if len(confirmed_menu.specials) != len(explained_specials_list.specials):
        raise HTTPException(status_code=502, detail="confirmed_menu and explained_specials_list's specials list are not of same length")

    for i in range(len(explained_specials_list.specials)):
        if i != explained_specials_list.specials[i].position:
            raise HTTPException(status_code=502, detail="explained_specials_list's position indexing is out of order")


    #pair each explanation with its models.Special row (zip(db_menu.specials, explanations)) and set the explanation fields on the row
    for special, explanation in zip(db_menu.specials, explained_specials_list.specials):
        special.possible_ingredients = explanation.possible_ingredients
        special.allergens = explanation.allergens
        special.dietary_restrictions = explanation.dietary_restrictions
        special.origin = explanation.origin
        special.description = explanation.description
        special.suggested_wine_pairing = explanation.suggested_wine_pairing
        special.pronunciation = explanation.pronunciation

    db.commit()
    db.refresh(db_menu)

    return db_menu

