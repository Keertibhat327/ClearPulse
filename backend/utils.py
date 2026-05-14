import { APIRouter, HTTPException } from "fastapi";
from pydantic import BaseModel
from typing import Any, Dict, Optional, List

class StandardResponse(BaseModel):
    """Standardized API response format for the application."""
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    errors: Optional[List[str]] = None

def success_response(data: Any = None, message: str = "Success") -> Dict[str, Any]:
    """Helper to return a standardized success response."""
    result = {"success": True, "message": message}
    if data is not None:
        result["data"] = data
    return result
    
def error_response(status_code: int, message: str, errors: List[str] = None) -> None:
    """Helper to raise a standardized HTTP exception."""
    detail = {"message": message}
    if errors:
        detail["errors"] = errors
    raise HTTPException(status_code=status_code, detail=detail)
