from anthropic import Anthropic
from anthropic import APIError
import base64
from typing import Literal

from app.schemas import Special, Menu
from app.config import ANTHROPIC_API_KEY


client = Anthropic(
    api_key=ANTHROPIC_API_KEY
)

class LLMError(Exception):
    pass


# function that prompts Anthropic
def get_text_from_llm(content_bytes: bytes, content_type: Literal['image/jpeg', 'image/png']) -> Menu:

    base64_encoded_string = base64.b64encode(content_bytes).decode("utf-8")
    try:
        response = client.messages.parse(
            model="claude-opus-5-5",
            max_tokens=2048,
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
        raise LLMError(f"Claude Issue: {e}") from e
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
        raise LLMError(f"Could not provide proper Menu structured output")
    
    return structured_response



