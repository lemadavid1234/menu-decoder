from anthropic import Anthropic
from anthropic import APIError
import base64
from typing import Literal

from app.schemas import Menu, ConfirmedMenu, ExplanationFieldsList
from app.config import ANTHROPIC_API_KEY


client = Anthropic(
    api_key=ANTHROPIC_API_KEY
)

class LLMError(Exception):
    pass


EXTRACTION_MODEL = "claude-haiku-5-5"
EXPLANATION_MODEL = "claude-opus-5-5"


# function that prompts Anthropic
def get_text_from_llm(content_bytes: bytes, content_type: Literal['image/jpeg', 'image/png']) -> Menu:

    base64_encoded_string = base64.b64encode(content_bytes).decode("utf-8")
    try:
        response = client.messages.parse(
            model=EXTRACTION_MODEL,
            max_tokens=1024,
            system= (
                "You are a text extractor being provided a photo of a restaurant's specials of the week.\n" 
                "Only extract text visible in the provided photo.\n"
                "Put anything unreadable or ambiguous in concerns.\n"
                "Set is_special to false if the photo isn't a specials menu.\n"
                "Use null for a price that isn't shown, rather than guessing.\n"
                "Mispellings should be noted in concerns such as: 'Misspelled words: (list of mispelled words). Correct Spelling: (list of properly spelled words in same order as misspelled words.)', not fixed directly.\n"
                "Date in the photo is in format: MM-DD-YYYY."
                ),
            messages = [ 
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": content_type, 
                                    "data": base64_encoded_string, 
                                },
                            },
                            { 
                                "type": "text",
                                "text": "Extract the key information from this image."
                            },
                        ],
                    }
                ],
            output_format=Menu,
        )
    except APIError as e:
        raise LLMError(f"Claude Issue during extraction pipeline {e}") from e
    print("-------------------------------\n")
    print("Raw Response: ", response)
    print("-------------------------------\n")
    print("-------------------------------\n")
    print("Parsed Response ", response.parsed_output)
    print("-------------------------------\n")

    # iterate through the blocks in response [ThinkingBlock, TextBlock]
    # text = "".join(b.text for b in response.content if b.type == "text")
    
    structured_response = response.parsed_output
    if not isinstance(structured_response, Menu):
        raise LLMError("Could not provide proper Menu structured output")
    
    return structured_response





def get_explanation_from_llm(menu: ConfirmedMenu) -> ExplanationFieldsList:


    #claude takes input as text, therefore first have to create a text block from menu parameter

    menu_json = menu.model_dump_json()

    try:
        response = client.messages.parse(
            model=EXPLANATION_MODEL,
            max_tokens=8192,
            system= (
                "You are an incredibly knowledgeable food explainer being provided a list of a restaurant's specials of the week.\n" 
                "For each special return the following fields:\n"
                "- position: index position starting from 0, one entry per special.\n"
                "- possible_ingredients: list of ingrediants explicitly mentioned or highly likely to be in the dish.\n"
                "- dietary_restrictions: applicable dietary tags (e.g., 'Vegan', 'Gluten-Free', 'Halal'). Return an empty list if none apply.\n"
                "- allergens: List of common allergens present (e.g., 'Nuts', 'Dairy', 'Soy', 'Shellfish'). Return an empty list if none apply.\n"
                "- suggested_wine_pairing: Recommended wine types or specific varietals that pair well with this item.\n"
                "- description: A rich sensory explanation of the item's flavor profile, texture, and preparation style.\n"
                "- origin: The geographic or cultural origin of the dish (e.g., 'Tuscany, Italy'). Leave as null if unknown.\n"
                "- pronunciation: A simple phonetic spelling guide for the dish name (e.g., 'gno-kee' for Gnocchi)\n"
                ),
            messages = [
                    {
                        "role": "user",
                        "content": [
                            { 
                                "type": "text",
                                "text": f"The following is a list of specials: {menu_json} "
                            },
                        ],
                    }
                ],
            output_format=ExplanationFieldsList,
        )
    except APIError as e:
        raise LLMError(f"Claude Issue during Explanation Pipeline: {e}") from e

    structured_response = response.parsed_output

    if not isinstance(structured_response, ExplanationFieldsList):
        raise LLMError("Could not provided proper ExplanationFieldsList structured output")

    return structured_response