# Architecture Documentation

## High-Level Architecture

```
User Browser
   └── Azure Front Door (optional) → Web App (App Service)
           ├─ Frontend: Next.js (React) + Tailwind CSS
           └─ Backend API: .NET Core Web API
                   ├─ Auth: Azure AD (OIDC / MSAL)
                   ├─ DB: Azure SQL (users, tiles, settings)
                   ├─ Cache: Azure Redis Cache (optional)
                   ├─ Secrets: Azure Key Vault
                   ├─ Storage: Blob Storage (icons, assets)
                   └─ Monitoring: Application Insights
```

## Networking

- **VNet**: Private subnets for backend resources
- **Private Endpoints**: Storage, SQL, App Service (optional)
- **Private Link**: For third-party SaaS when supported

## Components

### Frontend (Next.js)
- **Framework**: Next.js 14+ with App Router
- **Authentication**: MSAL.js v2 for Azure AD SSO
- **Styling**: Tailwind CSS
- **State Management**: React Context + hooks
- **PWA**: Progressive Web App capabilities

### Backend (.NET Core)
- **Framework**: .NET 7 Web API
- **Authentication**: Microsoft.Identity.Web
- **ORM**: Entity Framework Core
- **API Design**: RESTful with OpenAPI/Swagger

### Data Layer
- **Primary DB**: Azure SQL Database
- **Blob Storage**: Azure Blob Storage for assets
- **Cache**: Azure Redis Cache (optional, for v1)

### Security
- **Identity**: Azure AD (OIDC/OAuth 2.0)
- **Authorization**: Role-based (RBAC) via claims
- **Secrets**: Azure Key Vault with Managed Identity
- **Network**: Private Endpoints, NSG rules
- **Application**: WAF, CSP headers, rate limiting

## Data Flow

1. User authenticates via Azure AD (MSAL.js)
2. Frontend receives ID token
3. API calls include Bearer token
4. Backend validates token via Azure AD
5. Database queries use connection string from Key Vault
6. Third-party integrations use secure tokens/URLs

## Deployment Architecture

- **Environments**: dev, staging, production
- **Deployment**: Blue/green via App Service slots
- **IaC**: Bicep templates
- **CI/CD**: GitHub Actions
- **Monitoring**: Application Insights + Log Analytics

