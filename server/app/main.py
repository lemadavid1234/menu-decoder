from fastapi import FastAPI, UploadFile, HTTPException
from pathlib import Path
import uuid
from app.llm import get_text_from_llm, LLMError

app = FastAPI()

upload_dir = Path("./uploads") #begins where uvicorn was started (/server), therefore uploads go into /server/uploads
upload_dir.mkdir(exist_ok=True)


@app.post('/photos')
async def create_upload(photo: UploadFile):

    # uploading file with NO filename
    if not photo.filename:
        raise HTTPException(status_code=400, detail='Upload file missing a file name')

    # uploading file with unsupported media type
    if photo.content_type not in ('image/jpeg', 'image/png'):
        raise HTTPException(status_code=415, detail='Image type not supported. Must be .PNG or .JPG')

    # creating unique file_name
    unique_filename = f"{uuid.uuid4()}_{Path(photo.filename).stem}.{photo.content_type.split("/")[-1]}"


    content_bytes = await photo.read()

    # saves to local disk for manual checking if uploaded file wasn't corrupted and is the same one
    destination = f"{upload_dir}/{unique_filename}"
    with open(destination, "wb") as buffer:
        buffer.write(content_bytes)

    try:
        text = await get_text_from_llm(content_bytes, photo.content_type)

    except LLMError as e:
        raise HTTPException(status_code=502, detail=f"Error is: {e}")



    return {"original": photo.filename, "new_file_name": unique_filename,  "file_size": photo.size, "content_type": photo.content_type, "response": text, "successful": True}


# @app.post("/photos/{unique_filename}/extract")
# async def extract_photo(unique_filename: str, content_type: str):

#     relative_path = "photos/" + Path(unique_filename).name

#     if not Path(relative_path).is_file():
#         raise HTTPException(status_code=404, detail='File name provided does not match any existing file in /uploads')

#     # mime_type = 
#     # content_bytes = 
#     # content = await get_text_from_llm(content_bytes, mime_type)

#     return { "content": "this should return all extracted words from photo by LLM", "path_to_file": relative_path}