from anthropic import AsyncAnthropic
from anthropic import APIError
from dotenv import load_dotenv
from pathlib import Path
import os
import base64
from typing import Literal

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
async def get_text_from_llm(content_bytes: bytes, content_type: Literal['image/jpeg', 'image/png']) -> str:

    base64_encoded_string = base64.b64encode(content_bytes).decode("utf-8")
    try:
        response = await client.messages.create(
            model="claude-opus-5-5",
            max_tokens=1024,
            system= (
                "You are a text extracter.\n"
                "Return the following fields:\n"
                "- Week MM/DD/YYYY: from the top of the paper.\n"
                "- Specials List: in bullet points.\n"
                "- concerns: write if you found any issues with reading the text, such as text being cut off, or text being too blurry.\n"
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
                                "text": "Extract the text from this image."
                            },
                        ],
                    }
                ]
        )
    except APIError as e:
        raise LLMError(f"Claude Issue: {e}")
    print("-------------------------------\n")
    print(response)
    print("-------------------------------\n")

    # iterate through the blocks in response [ThinkingBlock, TextBlock]
    text = "".join(b.text for b in response.content if b.type == "text")

    return text



