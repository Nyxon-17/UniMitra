from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HistoryItem(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User question in Assamese or English")
    language: Optional[str] = Field("en", description="Target language: 'as' or 'en'")
    university_code: Optional[str] = Field(None, description="Target university abbreviation, e.g. 'DU', 'GU', 'TU'")
    category_code: Optional[str] = Field(None, description="Statutory category filter, e.g. 'EXAM-EVAL'")
    conversation_history: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Prior conversation context")


class VoiceSynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to synthesize to speech")
    language: Optional[str] = Field("as", description="'as' for Assamese, 'en' for English")
    gender: Optional[str] = Field("male", description="'male' for chatbot text listen, 'female' for voice assistant")
    voice: Optional[str] = Field(None, description="Direct neural voice override")


class TTSGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Original AI response to synthesize")
    language: Optional[str] = Field(None, description="Language hint ('as' or 'en')")
    gender: Optional[str] = Field("female", description="'female' for voice assistant, 'male' for listen")
    voice: Optional[str] = Field(None, description="Voice ID override")
