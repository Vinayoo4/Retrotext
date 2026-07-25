import httpx
from typing import Dict, Any, List
from app.config.settings import settings

class InferenceAdapter:
    def generate(self, prompt: str, system_prompt: str = "") -> str:
        raise NotImplementedError("Must implement generate()")

class OllamaAdapter(InferenceAdapter):
    def __init__(self):
        self.api_base = settings.LLM_API_BASE
        self.model = settings.LLM_MODEL

    def generate(self, prompt: str, system_prompt: str = "") -> str:
        try:
            # Assumes OpenAI-compatible endpoint like Ollama running with OpenAI compatibility layer
            url = f"{self.api_base}/chat/completions"
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.7
            }

            response = httpx.post(url, json=payload, timeout=60.0)
            response.raise_for_status()
            data = response.json()

            return data["choices"][0]["message"]["content"]

        except Exception as e:
            return f"Error connecting to LLM provider ({self.model} at {self.api_base}): {str(e)}"

# Global instance
llm_provider = OllamaAdapter()
