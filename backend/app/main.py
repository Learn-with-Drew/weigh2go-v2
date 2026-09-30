from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import Base, engine
from app.api.routes import auth, weight, food, goals, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables when the app actually starts serving."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Weigh2Go API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(weight.router)
app.include_router(food.router)
app.include_router(goals.router)
app.include_router(dashboard.router)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}