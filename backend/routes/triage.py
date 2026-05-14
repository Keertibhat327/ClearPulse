import json
import re
from typing import List, Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from google.genai import types
from google.genai.errors import ClientError
from services.gemini import get_gemini_client
from services.groq_client import get_groq_client
from services.insforge import db_select, db_insert

router = APIRouter()

class TriageMessage(BaseModel):
    role: str
    content: str

class TriageRequest(BaseModel):
    patient_id: str
    message: str
    history: List[TriageMessage] = []

@router.post("/chat")
async def triage_chat(req: TriageRequest):
    if not req.patient_id or not req.message:
        raise HTTPException(status_code=400, detail="patient_id and message are required")

    system_instruction = """You are an Emergency Triage Assistant designed for areas with severe doctor shortages. Your goal is to assess the patient's symptoms quickly and accurately.

STRICT PROTOCOL:
1. Gather necessary information about the user's symptoms concisely.
2. Once you have enough context, classify the severity into a `triage_level`: "Home", "Clinic", or "Emergency".
   - **Home**: Mild symptoms treatable with over-the-counter medication or rest.
   - **Clinic**: Symptoms requiring a doctor's visit within a few days (e.g., persistent fever, minor injuries, localized pain).
   - **Emergency**: Severe, life-threatening symptoms (e.g., chest pain, difficulty breathing, severe bleeding, stroke signs).
3. Do NOT provide a medical diagnosis. Instead, offer a `recommended_action` (e.g., "Rest and drink fluids", "Schedule a doctor appointment", "Call emergency services immediately").

Respond STRICTLY as a JSON object matching this exact schema:
{
  "response": "Your conversational reply to the patient, asking for more details or explaining your assessment.",
  "triage_level": "Home" | "Clinic" | "Emergency" | "Assessing",
  "recommended_action": "Clear actionable advice based on the triage level. Empty string if still assessing."
}
"""

    client = get_gemini_client()

    # Convert history to Gemini format
    new_sdk_history = []
    for h in req.history:
        role = "user" if h.role == "user" else "model"
        new_sdk_history.append(
            types.Content(role=role, parts=[types.Part(text=h.content)])
        )

    chat_session = client.chats.create(
        model="gemini-2.5-flash",
        history=new_sdk_history,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.2,
            response_mime_type="application/json",
            max_output_tokens=1024,
        ),
    )

    response_text = None
    try:
        result = chat_session.send_message(req.message)
        response_text = result.text
    except Exception as e:
        status_code = getattr(e, "code", 500)
        if status_code in (429, 500, 502, 503, 504) or isinstance(e, ClientError):
            print(f"Gemini unavailable ({status_code}). Falling back to Groq...")
            groq_client = get_groq_client()
            if groq_client:
                messages = [{"role": "system", "content": system_instruction}]
                for h in req.history:
                    messages.append({"role": "user" if h.role == "user" else "assistant", "content": h.content})
                messages.append({"role": "user", "content": req.message})
                
                try:
                    completion = groq_client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=messages,
                        temperature=0.2,
                        response_format={"type": "json_object"},
                    )
                    response_text = completion.choices[0].message.content
                except Exception as groq_e:
                    print(f"Groq fallback also failed: {groq_e}")
                    raise HTTPException(status_code=500, detail="Failed to process triage request (both AI services down).")
            else:
                raise HTTPException(status_code=500, detail="Gemini failed and Groq API key is not configured.")
        else:
            print(f"Error calling Gemini: {e}")
            raise HTTPException(status_code=500, detail="Failed to process triage request.")

    if not response_text:
        raise HTTPException(status_code=500, detail="Failed to get valid response from AI.")

    # Extract JSON
    try:
        response_json = json.loads(re.sub(r"```json\n?|\n?```", "", response_text).strip())
    except Exception:
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if json_match:
            response_json = json.loads(json_match.group(0))
        else:
            response_json = {
                "response": response_text,
                "triage_level": "Assessing",
                "recommended_action": ""
            }
    
    # Ensure correct keys
    response_json.setdefault("response", "I'm having trouble understanding. Could you describe your symptoms again?")
    response_json.setdefault("triage_level", "Assessing")
    response_json.setdefault("recommended_action", "")

    # Fire and forget DB save (optional)
    try:
        await db_insert("triage_history", {
            "patient_id": req.patient_id,
            "role": "user",
            "message": req.message
        })
        await db_insert("triage_history", {
            "patient_id": req.patient_id,
            "role": "assistant",
            "message": response_json["response"],
            "triage_level": response_json["triage_level"],
            "recommended_action": response_json["recommended_action"]
        })
    except Exception as e:
        print(f"[DB] Optional triage history save failed: {e}")

    return response_json
