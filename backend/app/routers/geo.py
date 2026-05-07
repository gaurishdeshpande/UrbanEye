from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/geo", tags=["geo"])

@router.get("/buildings")
async def get_buildings(lat: float, lon: float, radius: int = 500):
    """
    Proxies request to OSM Overpass API to fetch building footprints.
    Returns GeoJSON-like structure or raw Overpass JSON.
    """
    query = f"""
    [out:json][timeout:30];
    (
      way["building"](around:{radius},{lat},{lon});
      relation["building"](around:{radius},{lat},{lon});
    );
    out body;
    >;
    out skel qt;
    """
    
    overpass_url = "https://overpass-api.de/api/interpreter"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(overpass_url, data=query, timeout=30.0)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch from Overpass API: {str(e)}")
