# Weigh2Go v2

A full-stack web application for tracking weight and calorie intake to help users maintain a healthier lifestyle.

## Overview

**Weigh2Go** is a rebuild of the original Android app, now reimagined as a modern web application. The core mission is to help users:

- Log and visualize their weight progress over time
- Track daily food intake and calorie consumption
- Compare actual calories consumed vs. their daily goals
- Build healthier eating and fitness habits

This rebuild is designed to showcase modern web development practices, including clean architecture, comprehensive testing, Docker containerization, and CI/CD pipeline automation.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Recharts
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL
- **Infrastructure**: Docker, Docker Compose, GitHub Actions CI
- **Testing**: Pytest (backend, 80%+ coverage), Vitest (frontend)

## Features (Core)

✅ **Authentication**

- User registration and login with email/password
- httpOnly cookies + CSRF protection
- Secure session management

✅ **Weight Logging**

- Log daily weight
- View weight trends over 7, 14, 30, or 90 days
- Trend visualization with charts
- One log per day (updates if re-submitted)

✅ **Calorie Tracking**

- Log food and calorie intake
- Multiple entries per day
- View daily calorie totals vs. target
- Daily summary dashboard

✅ **Goals & Settings**

- Set daily calorie target (default: 2000)
- Choose weight unit (lbs or kg)
- Editable at any time

📅 **Dashboard**

- Daily summary: total calories, remaining, weight logged today
- Weekly tracking: days weight was logged this week
- Date-based filtering

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Learn-with-Drew/weigh2go-v2.git
   cd weigh2go-v2
   ```

2. **Copy environment variables**:

   ```bash
   cp .env.example .env
   ```

3. **Start the application**:

   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:8000>
   - API Docs: <http://localhost:8000/docs>

### Initial Setup (First Time)

The database will be created automatically. No manual migrations needed for the first run.

## Development

### Run Tests

**Backend** (with coverage):

```bash
docker-compose exec backend pytest app/tests --cov
```

**Frontend**:

```bash
docker-compose exec frontend npm test
```

### Lint & Format

**Backend**:

```bash
docker-compose exec backend pylint app
```

**Frontend**:

```bash
docker-compose exec frontend npm run lint
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop the Application

```bash
docker-compose down
```

## Project Structure

```text
weigh2go-v2/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/routes/   # API endpoint definitions
│   │   ├── core/         # Config, security, utilities
│   │   ├── tests/        # Unit and integration tests
│   │   ├── models.py     # SQLAlchemy models
│   │   ├── schemas.py    # Pydantic validators
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # React/TypeScript frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # API calls
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript types
│   │   └── tests/        # Component and unit tests
│   ├── package.json
│   └── Dockerfile
├── .github/workflows/     # GitHub Actions CI/CD
├── docker-compose.yml     # Local development orchestration
└── README.md
```

## API Documentation

Once the backend is running, visit **<http://localhost:8000/docs>** for interactive Swagger documentation.

### Key Endpoints

**Auth**:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

**Weight**:

- `POST /api/weight` - Create weight log
- `GET /api/weight` - Get all weight logs
- `GET /api/weight/trend?days=30` - Get weight trend
- `DELETE /api/weight/{id}` - Delete weight log

**Food**:

- `POST /api/food` - Create food log
- `GET /api/food` - Get food logs
- `DELETE /api/food/{id}` - Delete food log

**Dashboard**:

- `GET /api/dashboard/summary?logged_date=2026-09-18` - Get daily summary

**Goals**:

- `GET /api/goals` - Get user goals
- `PUT /api/goals` - Update user goals

## Testing Strategy

### Backend

- Unit tests for all endpoints
- Integration tests with PostgreSQL
- Target: 80%+ code coverage
- Tests run automatically on push via GitHub Actions

### Frontend

- Component tests with React Testing Library
- Service/API tests with Vitest
- Test files co-located with components

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and write tests
3. Run tests locally: `npm test` (frontend) or `pytest` (backend)
4. Commit and push: `git commit -m "Add my feature"`
5. Open a pull request

## CI/CD Pipeline

GitHub Actions automatically:

- Runs all tests on push/PR
- Lints backend (pylint) and frontend (ESLint)
- Builds Docker images
- Reports coverage metrics

See `.github/workflows/ci.yml` for details.

## Next Steps (Roadmap)

- 🔄 Sprint 2: Weight logging & charts
- 🍽️ Sprint 3: Food/calorie tracking
- 📊 Sprint 4: Advanced dashboard
- ☁️ Deploy to AWS (ECS/RDS)
- 🔍 Add food database lookup (USDA FoodData Central)
- 📱 Mobile-responsive UI improvements
- 🔐 Multi-factor authentication

## Known Limitations

- No real food database integration yet (manual entry only)
- Frontend component scaffold is minimal (focus on backend/testing first)
- Deployment guide (AWS) coming after core features complete

## License

MIT

## Author

Andrew Tran ([@Learn-with-Drew](https://github.com/Learn-with-Drew))
