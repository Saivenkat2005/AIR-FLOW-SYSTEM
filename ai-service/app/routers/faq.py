from fastapi import APIRouter
from app.schemas.schemas import FaqRequest, FaqResponse
from app.providers.ai_factory import AiProviderFactory

router = APIRouter()

@router.post("", response_model=FaqResponse)
async def ask_faq(request: FaqRequest):
    provider = await AiProviderFactory.get_provider()
    ans = await provider.generate_response(request.question)
    return FaqResponse(
        question=request.question,
        answer=ans,
        matched_category="Aviation Customer Policy",
        confidence=0.98
    )
