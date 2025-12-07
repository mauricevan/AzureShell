# Azure Portal Shell - Backend

.NET 7 Web API backend for the Azure Employee Portal.

## Tech Stack

- **.NET 7** - Framework
- **Entity Framework Core** - ORM
- **Azure SQL** - Database
- **Microsoft.Identity.Web** - Azure AD authentication
- **Swagger/OpenAPI** - API documentation

## Getting Started

### Prerequisites

- .NET 7 SDK
- SQL Server LocalDB or SQL Server Express
- Azure AD App Registration

### Configuration

1. Update `appsettings.json`:
   - Azure AD configuration (TenantId, ClientId, etc.)
   - Database connection string
   - Frontend URL for CORS

### Database Setup

The database will be created automatically on first run (development mode). For production, use migrations:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Development

```bash
dotnet restore
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`
- Swagger: `https://localhost:5001/swagger`

### Project Structure

```
backend/
├── Controllers/      # API controllers
│   ├── TilesController.cs
│   ├── UsersController.cs
│   └── AdminController.cs
├── Models/          # Data models
├── Services/        # Business logic
├── Data/           # DbContext and migrations
└── Program.cs      # Application entry point
```

## Features

- Azure AD JWT authentication
- RESTful API
- Entity Framework Core for data access
- Role-based authorization (Admin, Editor)
- Swagger/OpenAPI documentation

## API Documentation

See `/docs/API.md` for detailed API documentation.

## Environment Variables

For production, configure via Azure App Service Application Settings or Key Vault references.

