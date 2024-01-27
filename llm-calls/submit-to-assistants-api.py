from openai import OpenAI
from dotenv import load_dotenv
import os
import time
import json

# Load environment variables from the .env file
load_dotenv()

# Assign script variables from environment variables placed by our .env file.
assistant_id = os.getenv("ASSISTANT_ID")
OPENAI_API_KEY = os.getenv("THE_API_KEY")

client = OpenAI(
    api_key=OPENAI_API_KEY
)

def get_response(user_input):
    thread = client.beta.threads.create(
        messages=[{"role": "user", "content": user_input}]
    )
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id
    )

    while run.status != 'completed':
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        time.sleep(1)

    thread_messages = client.beta.threads.messages.list(thread.id)

    for msg in thread_messages.data:
        if msg.role == "assistant":
            if isinstance(msg.content, list):
                formatted_response = ""
                for content_part in msg.content:
                    if hasattr(content_part, 'text') and hasattr(content_part.text, 'value'):
                        formatted_response = content_part.text.value
                        return formatted_response.replace("\\n", "\n").replace("```", "")
            else:
                # If the response content is not in the expected list format,
                # return a fallback message
                return "Received response in unexpected format."

# Replace the line below with the user input you would like to process
user_input = input() #Input handler. Perhaps consider adding a leading "Data: "
response = get_response(user_input)
print(response)
