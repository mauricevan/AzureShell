# Azure Employee Portal Shell

A custom employee landing page portal built on Azure with SSO, tile management, and secure third-party integrations.

## Architecture Overview

- **Frontend**: Next.js (React) with Tailwind CSS, MSAL.js for Azure AD SSO
- **Backend**: .NET Core Web API with Azure AD authentication
- **Infrastructure**: Azure App Service, Azure SQL, Azure Storage, Azure Key Vault
- **Security**: Private Endpoints, Azure AD Conditional Access, WAF
- **CI/CD**: GitHub Actions with Infrastructure as Code (Bicep)

## Project Structure

```
├── frontend/          # Next.js application
├── backend/           # .NET Core Web API
├── infrastructure/    # Bicep templates for Azure resources
├── docs/              # Documentation
└── .github/workflows/ # CI/CD pipelines
```

## Quick Start

### Prerequisites

- Azure subscription with appropriate permissions
- Azure AD tenant configured
- Node.js 18+ and .NET 7 SDK installed
- Azure CLI installed and configured

### Setup

1. **Configure Azure AD App Registration**:
   - Register a new app in Azure AD
   - Configure redirect URIs
   - Note the Application (client) ID and Directory (tenant) ID

2. **Deploy Infrastructure**:
   ```bash
   cd infrastructure
   az deployment group create --resource-group <rg-name> --template-file main.bicep --parameters @parameters.json
   ```

3. **Configure Backend**:
   - Update `appsettings.json` with Azure AD settings
   - Configure connection strings in Azure App Service

4. **Configure Frontend**:
   - Update `.env.local` with Azure AD client ID and tenant ID

5. **Run Locally**:
   ```bash
   # Backend
   cd backend
   dotnet run

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

## Features

### MVP
- ✅ Azure AD SSO authentication
- ✅ Tile catalog management
- ✅ User tile customization (add/remove/reorder)
- ✅ Admin catalog management
- ✅ Audit logging

### v1 (Planned)
- Per-user personalization & tagging
- Role-based visibility
- Deep linking with SSO
- Secure external app sharing

### v2 (Planned)
- Private Link integrations
- Third-party SSO via enterprise apps
- Mobile PWA features
- Analytics dashboard

## Security

- HTTPS everywhere (TLS 1.2+)
- Managed Identities for resource access
- Secrets stored in Azure Key Vault
- WAF protection via Azure Front Door
- Private Endpoints for data layer
- CSP headers and security headers

## Documentation

See `/docs` folder for:
- Architecture diagrams
- API documentation (OpenAPI)
- Setup guide
- Runbook for operations

## License

Proprietary - Internal use only

