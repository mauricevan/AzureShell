# Deployment Guide

This guide covers deploying the Azure Employee Portal to Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed and authenticated
- GitHub repository (for CI/CD)
- Azure AD App Registration completed

## Step 1: Deploy Infrastructure

### Create Resource Group

```bash
az group create \
  --name rg-azure-portal-shell-prod \
  --location "West Europe"
```

### Deploy Bicep Template

```bash
cd infrastructure

# Copy and edit parameters
cp parameters.json.example parameters.json
# Edit parameters.json with your values

# Deploy
az deployment group create \
  --resource-group rg-azure-portal-shell-prod \
  --template-file main.bicep \
  --parameters @parameters.json
```

### Configure Key Vault Access

Grant yourself access to read secrets:

```bash
az keyvault set-policy \
  --name <keyVaultName> \
  --upn <your-email> \
  --secret-permissions get list set
```

## Step 2: Configure Azure AD App Registration

1. Add production redirect URI:
   - Azure Portal > App registrations > Your app
   - Authentication > Add platform > Single-page application
   - URI: `https://your-app.azurewebsites.net`

2. Add API scope if not already done:
   - Expose an API > Add a scope
   - Name: `access_as_user`

## Step 3: Configure App Service

### Backend Configuration

1. Go to Azure Portal > App Service > Configuration
2. Add Application Settings:
   - `AzureAd__Instance`: `https://login.microsoftonline.com/`
   - `AzureAd__TenantId`: `<your-tenant-id>`
   - `AzureAd__ClientId`: `<your-client-id>`
   - `AzureAd__Audience`: `api://<your-client-id>`
   - `Frontend__Url`: `https://your-frontend.azurewebsites.net`
   - `ConnectionStrings__DefaultConnection`: Reference to Key Vault secret

3. Enable System Assigned Managed Identity

### Frontend Configuration

For Next.js, deploy as Static Web App or App Service:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy output folder (`.next` and `public`) to App Service

## Step 4: Database Migration

### Option 1: Automated (Development)

The app will create the database on first run in development mode.

### Option 2: Manual Migration (Production)

```bash
cd backend
dotnet ef migrations add Production
dotnet ef database update --connection "your-connection-string"
```

## Step 5: CI/CD Setup

### GitHub Secrets

Add the following secrets to your GitHub repository:

- `AZURE_CREDENTIALS` - Azure service principal credentials
- `AZURE_CLIENT_ID` - Azure AD App Client ID
- `AZURE_TENANT_ID` - Azure AD Tenant ID
- `API_URL` - Production API URL
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Static Web Apps deployment token (if using)

### Azure Service Principal

Create a service principal for CI/CD:

```bash
az ad sp create-for-rbac \
  --name "azure-portal-shell-cicd" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/rg-azure-portal-shell-prod \
  --sdk-auth
```

Copy the output JSON and add as GitHub secret `AZURE_CREDENTIALS`.

## Step 6: Private Endpoints (Optional, Production)

For enhanced security, configure Private Endpoints:

1. Create VNet and subnets
2. Update Bicep template to include:
   - Private Endpoint for SQL
   - Private Endpoint for Storage
   - Private Endpoint for App Service (optional)

See infrastructure documentation for Private Endpoint configuration.

## Step 7: Monitoring Setup

1. Application Insights is already configured in Bicep template
2. Set up alerts:
   - High error rate
   - High latency
   - Failed authentication attempts

3. Configure Log Analytics queries for custom dashboards

## Step 8: SSL/TLS Configuration

1. App Service uses HTTPS by default
2. For custom domain:
   - Add custom domain in App Service
   - Configure SSL certificate (App Service Managed Certificate or upload)
   - Update DNS records

## Rollback Strategy

1. Use deployment slots for blue/green deployments
2. Test in staging slot first
3. Swap slots for zero-downtime deployment
4. Can quickly swap back if issues occur

## Security Checklist

- [ ] HTTPS enforced
- [ ] Private Endpoints configured (production)
- [ ] WAF rules configured
- [ ] Key Vault for secrets
- [ ] Managed Identities used
- [ ] CORS properly configured
- [ ] Authentication and authorization tested
- [ ] Database encryption enabled
- [ ] Audit logging enabled

## Post-Deployment

1. Test authentication flow
2. Verify API endpoints
3. Check Application Insights logs
4. Test tile add/remove functionality
5. Verify database connectivity
6. Test admin functions

## Maintenance

- Regular security updates
- Monitor Application Insights
- Review audit logs
- Backup database regularly
- Update dependencies periodically

