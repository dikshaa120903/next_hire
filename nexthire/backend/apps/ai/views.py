import os
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.serializers import ChatInputSerializer, ImproveResumeInputSerializer

logger = logging.getLogger(__name__)


def _openai_chat_completion(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        error_msg = (
            "OPENAI_API_KEY is not set. Please configure your OpenAI API key "
            "by setting the OPENAI_API_KEY environment variable. "
            "Get your key from: https://platform.openai.com/api-keys"
        )
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise ImportError("openai package is required. Install with: pip install openai") from exc
    
    try:
        model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        client = OpenAI(api_key=api_key)
        completion = client.chat.completions.create(
            model=model_name,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise


class ImproveResumeAPIView(APIView):
    def post(self, request):
        serializer = ImproveResumeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume_text = serializer.validated_data["resume_text"]
        custom_prompt = serializer.validated_data.get("custom_prompt")
        job_description = serializer.validated_data.get("job_description")
        
        system_prompt = "You are an expert resume coach."
        if job_description:
            user_prompt = f"{custom_prompt}\n\nJob Description:\n{job_description}\n\nResume Text:\n{resume_text}"
        elif custom_prompt:
            user_prompt = f"{custom_prompt}\n\nResume Text:\n{resume_text}"
        else:
            user_prompt = (
                "Improve the following resume text with strong action verbs, measurable impact, and better clarity. "
                "Preserve truthfulness and output a polished professional version.\n\n"
                f"{resume_text}"
            )
            
        try:
            improved_text = _openai_chat_completion(system_prompt, user_prompt, temperature=0.4)
            return Response({"improved_resume": improved_text}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class ChatAPIView(APIView):
    def post(self, request):
        serializer = ChatInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data["message"]
        resume_context = serializer.validated_data.get("resume_context", "")
        system_prompt = (
            "You are HireSense AI assistant. Provide concise, practical career guidance "
            "using any resume context given."
        )
        user_prompt = f"Resume Context:\n{resume_context}\n\nUser Message:\n{message}"
        try:
            answer = _openai_chat_completion(system_prompt, user_prompt, temperature=0.5)
            return Response({"response": answer}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
