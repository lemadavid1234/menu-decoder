from anthropic import AsyncAnthropic
from anthropic import APIError
from dotenv import load_dotenv
from pathlib import Path
import os
import base64
from typing import Literal

from app.schemas import Special, Menu

#loads .env file from folder of the file that called it /server/app and walks upward (server/app/.env -> /server/.env)
#stops at the first .env it finds, stops at /server/.env
# load_dotenv() --> also works 
load_dotenv(Path(__file__).parent.parent / ".env")

client = AsyncAnthropic(
    api_key=os.environ["ANTHROPIC_API_KEY"] # raises KeyError if not found: 'ANTHROPIC_API_KEY'
)

class LLMError(Exception):
    pass


# function that prompts Anthropic
async def get_text_from_llm(content_bytes: bytes, content_type: Literal['image/jpeg', 'image/png']) -> Menu:

    base64_encoded_string = base64.b64encode(content_bytes).decode("utf-8")
    try:
        response = await client.messages.parse(
            model="claude-opus-5-5",
            max_tokens=2048,
            system= (
                "You are a text extracter.\n"
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



