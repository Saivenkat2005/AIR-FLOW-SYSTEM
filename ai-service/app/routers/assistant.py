from fastapi import APIRouter
from app.schemas.schemas import AssistantChatRequest, AssistantChatResponse
from app.providers.ai_factory import AiProviderFactory
from app.services.flight_ai_service import FlightAiService

router = APIRouter()

@router.post("/chat", response_model=AssistantChatResponse)
@router.post("", response_model=AssistantChatResponse)
async def travel_assistant(request: AssistantChatRequest):
    msg = request.message.lower()
    provider = await AiProviderFactory.get_provider()
    
    # Check if this is a flight search query
    if any(k in msg for k in ["find", "search", "show", "flight", "delhi", "mumbai", "hyd", "bangalore", "to "]):
        search_res = await FlightAiService.smart_search(request.message)
        reply = (
            f"Found {len(search_res.results)} verified scheduled corridor(s) matching your request. "
            f"All flights include live seat selection and transparent fare breakdowns."
        )
        return AssistantChatResponse(
            reply=reply,
            intent="FLIGHT_SEARCH",
            filters=search_res.extracted_params.model_dump() if hasattr(search_res.extracted_params, 'model_dump') else search_res.extracted_params.dict(),
            flights=search_res.results[:4]
        )

    # General reasoning query (baggage, policies, check-in)
    reply_text = await provider.generate_response(request.message)
    return AssistantChatResponse(
        reply=reply_text,
        intent="GENERAL_ASSISTANCE",
        filters=None,
        flights=None
    )
