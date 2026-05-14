from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.insforge import db_select, db_update

router = APIRouter()


def _is_database_unavailable(error: Exception) -> bool:
    error_msg = str(error).lower()
    error_type = error.__class__.__name__.lower()
    combined = f"{error_msg} {error_type}"
    return any(
        marker in combined
        for marker in (
            "503",
            "service temporarily unavailable",
            "readtimeout",
            "timeout",
            "connecterror",
            "nodename nor servname",
            "name or service not known",
            "connection refused",
        )
    )


@router.get("/appointments/{wallet}")
async def get_appointments(wallet: str):
    """Return all appointments for a patient wallet, enriched with doctor names."""
    if not wallet:
        raise HTTPException(status_code=400, detail="wallet address is required")

    try:
        appts = await db_select(
            "appointments",
            filters={"patient_wallet": wallet},
            order="date.asc",
        )

        if appts:
            doctor_wallets = list({a["doctor_wallet"] for a in appts if a.get("doctor_wallet")})
            profiles_raw = []
            for dw in doctor_wallets:
                try:
                    rows = await db_select("doctor_profiles", filters={"wallet_address": dw})
                    profiles_raw.extend(rows)
                except Exception:
                    pass

            profile_map = {p["wallet_address"]: p for p in profiles_raw}
            enriched = [
                {
                    **a,
                    "doctor_name": profile_map.get(a.get("doctor_wallet", ""), {}).get("name"),
                    "doctor_specialty": profile_map.get(a.get("doctor_wallet", ""), {}).get("specialty"),
                }
                for a in appts
            ]
            return {"success": True, "appointments": enriched}

        return {"success": True, "appointments": []}
        
    except Exception as e:
        error_msg = str(e)
        
        if _is_database_unavailable(e):
            print(f"InsForge service temporarily unavailable for appointments: {error_msg}")
            return {
                "success": True, 
                "appointments": [],
                "service_status": "temporarily_unavailable",
                "message": "Appointment service is temporarily unavailable. Please try again in a few minutes."
            }
        
        # For other errors, raise as before
        raise HTTPException(status_code=500, detail=f"Failed to fetch appointments: {error_msg}")


class CancelAppointmentRequest(BaseModel):
    appointment_id: str


@router.patch("/appointments/{appointment_id}/cancel")
async def cancel_appointment(appointment_id: str):
    """Cancel an appointment by ID."""
    try:
        from datetime import datetime, timezone
        await db_update("appointments", appointment_id, {
            "status": "cancelled",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cancel appointment: {str(e)}")

@router.get("/appointments/slots/{doctor_wallet}/{date}")
async def get_booked_slots(doctor_wallet: str, date: str):
    """Return booked slots for a specific doctor and date."""
    try:
        from services.insforge import db_select
        appts = await db_select(
            "appointments",
            filters={"doctor_wallet": doctor_wallet, "date": date}
        )
        # Filter out cancelled
        booked = [a["time"][:5] for a in appts if a.get("status") != "cancelled" and "time" in a]
        return {"success": True, "booked_slots": booked}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch slots: {str(e)}")

class CreateAppointmentRequest(BaseModel):
    patient_wallet: str
    doctor_wallet: str
    date: str
    time: str
    reason: str = ""

@router.post("/appointments")
async def create_appointment(payload: CreateAppointmentRequest):
    """Create a new appointment request."""
    try:
        from services.insforge import db_insert
        await db_insert("appointments", {
            "patient_wallet": payload.patient_wallet,
            "doctor_wallet": payload.doctor_wallet,
            "date": payload.date,
            "time": payload.time,
            "reason": payload.reason,
            "status": "pending",
        })
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create appointment: {str(e)}")
