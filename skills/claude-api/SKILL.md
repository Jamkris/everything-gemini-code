---
name: gemini-api
description: Google Gemini API patterns for Python and TypeScript. Covers content generation, streaming, tool use (function calling), vision, system instructions, context caching, batch requests, and agent workflows. Use when building applications with the Gemini API or Google Generative AI SDKs.
origin: ECC
---

# Gemini API

Build applications with the Google Gemini API and SDKs.

## When to Use

- Building applications that call the Gemini API
- Code imports `google.generativeai` (Python) or `@google/generative-ai` (TypeScript)
- User asks about Gemini API patterns, function calling, streaming, or vision
- Implementing agent workflows with the Gemini API
- Optimizing API costs, token usage, or latency

## Model Selection

| Model | ID | Best For |
|-------|-----|----------|
| Pro 2.5 | `gemini-2.5-pro` | Complex reasoning, architecture, research |
| Flash 2.5 | `gemini-2.5-flash` | Balanced coding, most development tasks |
| Flash Lite 2.5 | `gemini-2.5-flash-lite` | Fast responses, high-volume, cost-sensitive |

Default to Flash 2.5 unless the task requires deep reasoning (Pro) or speed/cost optimization (Flash Lite). For production, prefer pinned snapshot IDs over aliases.

## Python SDK

### Installation

```bash
pip install google-generativeai
```

### Basic Message

```python
import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content("Explain async/await in Python")
print(response.text)
```

### Streaming

```python
model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content(
    "Write a haiku about coding",
    stream=True,
)
for chunk in response:
    print(chunk.text, end="", flush=True)
```

### System Instruction

```python
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction="You are a senior Python developer. Be concise.",
)
response = model.generate_content("Review this function")
```

## TypeScript SDK

### Installation

```bash
npm install @google/generative-ai
```

### Basic Message

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const result = await model.generateContent("Explain async/await in TypeScript");
console.log(result.response.text());
```

### Streaming

```typescript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const result = await model.generateContentStream("Write a haiku");

for await (const chunk of result.stream) {
  const text = chunk.text();
  process.stdout.write(text);
}
```

## Function Calling (Tool Use)

Define tools and let Gemini call them:

```python
def get_weather(location: str, unit: str = "celsius") -> dict:
    """Get current weather for a location."""
    # Your implementation here
    return {"temp": 18, "unit": unit, "location": location}

model = genai.GenerativeModel(
    "gemini-2.5-flash",
    tools=[get_weather],
)

chat = model.start_chat(enable_automatic_function_calling=True)
response = chat.send_message("What's the weather in SF?")
print(response.text)
```

For manual function calling (more control):

```python
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool

weather_func = FunctionDeclaration(
    name="get_weather",
    description="Get current weather for a location",
    parameters={
        "type": "object",
        "properties": {
            "location": {"type": "string", "description": "City name"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
        },
        "required": ["location"],
    },
)

tool = Tool(function_declarations=[weather_func])
model = genai.GenerativeModel("gemini-2.5-flash", tools=[tool])

chat = model.start_chat()
response = chat.send_message("What's the weather in SF?")

# Check for function call in response
for part in response.parts:
    if fn := part.function_call:
        # Execute the function with fn.args
        result = get_weather(**dict(fn.args))
        # Send result back
        response = chat.send_message(
            genai.protos.Content(
                parts=[genai.protos.Part(
                    function_response=genai.protos.FunctionResponse(
                        name=fn.name,
                        response={"result": result},
                    )
                )]
            )
        )
```

## Vision

Send images for analysis:

```python
import PIL.Image

image = PIL.Image.open("diagram.png")

model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content(
    ["Describe this diagram", image]
)
print(response.text)
```

Or from raw bytes:

```python
with open("diagram.png", "rb") as f:
    image_data = f.read()

response = model.generate_content([
    "Describe this diagram",
    {"mime_type": "image/png", "data": image_data},
])
```

## Thinking (Extended Reasoning)

For complex reasoning tasks, enable thinking in the generation config:

```python
model = genai.GenerativeModel("gemini-2.5-flash")
response = model.generate_content(
    "Solve this math problem step by step...",
    generation_config=genai.GenerationConfig(
        thinking_config=genai.types.ThinkingConfig(
            thinking_budget=10000,
        ),
    ),
)

for part in response.candidates[0].content.parts:
    if part.thought:
        print(f"Thinking: {part.text}")
    else:
        print(f"Answer: {part.text}")
```

## Context Caching

Cache large contexts to reduce costs on repeated requests:

```python
from google.generativeai import caching
import datetime

cache = caching.CachedContent.create(
    model="gemini-2.5-flash",
    display_name="my-cached-context",
    system_instruction="You are an expert analyst.",
    contents=[large_context_text],
    ttl=datetime.timedelta(minutes=30),
)

# Use the cached content with a model
model = genai.GenerativeModel.from_cached_content(cache)
response = model.generate_content("Question about the cached context")
```

## Batch Requests

Process multiple requests efficiently:

```python
model = genai.GenerativeModel("gemini-2.5-flash")

# Use asyncio for concurrent requests
import asyncio

async def process_batch(prompts: list[str]) -> list[str]:
    """Process multiple prompts concurrently."""
    async_model = genai.GenerativeModel("gemini-2.5-flash")
    tasks = [
        async_model.generate_content_async(prompt)
        for prompt in prompts
    ]
    responses = await asyncio.gather(*tasks)
    return [r.text for r in responses]

# Run the batch
results = asyncio.run(process_batch(prompts))
```

## Agent Loop

Build multi-step agents with function calling:

```python
import google.generativeai as genai

# Define tools as function declarations
tools = [
    genai.protos.Tool(function_declarations=[
        genai.protos.FunctionDeclaration(
            name="search_codebase",
            description="Search the codebase for relevant code",
            parameters={
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
        )
    ])
]

model = genai.GenerativeModel("gemini-2.5-flash", tools=tools)
chat = model.start_chat()

response = chat.send_message("Review the auth module for security issues")

# Agentic loop: keep processing function calls until the model stops
while response.candidates[0].finish_reason.name == "STOP" and any(
    part.function_call for part in response.parts
):
    for part in response.parts:
        if fn := part.function_call:
            result = execute_tool(fn.name, dict(fn.args))
            response = chat.send_message(
                genai.protos.Content(
                    parts=[genai.protos.Part(
                        function_response=genai.protos.FunctionResponse(
                            name=fn.name,
                            response={"result": result},
                        )
                    )]
                )
            )

print(response.text)
```

## Cost Optimization

| Strategy | Savings | When to Use |
|----------|---------|-------------|
| Context caching | Up to 75% on cached tokens | Repeated system prompts or context |
| Batch with async | Variable | Non-time-sensitive bulk processing |
| Flash Lite instead of Flash | ~75% | Simple tasks, classification, extraction |
| Shorter max_output_tokens | Variable | When you know output will be short |
| Streaming | None (same cost) | Better UX, same price |

## Error Handling

```python
import time

from google.api_core.exceptions import (
    ResourceExhausted,
    ServiceUnavailable,
    GoogleAPIError,
)

try:
    response = model.generate_content(...)
except ResourceExhausted:
    # Rate limited, back off and retry
    time.sleep(60)
except ServiceUnavailable:
    # Service issue, retry with backoff
    pass
except GoogleAPIError as e:
    print(f"API error: {e.message}")
```

## Environment Setup

```bash
# Required
export GEMINI_API_KEY="your-api-key-here"

# Optional: set default model
export GEMINI_MODEL="gemini-2.5-flash"
```

Never hardcode API keys. Always use environment variables.
