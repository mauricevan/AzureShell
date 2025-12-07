# Infrastructure as Code (Bicep)

This directory contains Bicep templates for deploying the Azure Employee Portal infrastructure.

## Prerequisites

- Azure CLI installed and configured
- Appropriate Azure subscription permissions
- Azure AD App Registration created

## Deployment

### 1. Create Resource Group

```bash
az group create --name rg-azure-portal-shell-dev --location "West Europe"
```

### 2. Deploy Infrastructure

```bash
# Copy and update parameters file
cp parameters.json.example parameters.json
# Edit parameters.json with your values

# Deploy
az deployment group create \
  --resource-group rg-azure-portal-shell-dev \
  --template-file main.bicep \
  --parameters @parameters.json
```

### 3. Configure Key Vault Access

After deployment, grant yourself access to Key Vault:

```bash
az keyvault set-policy \
  --name <keyVaultName> \
  --upn <your-email> \
  --secret-permissions get list set
```

## Resources Created

- **App Service Plan**: Hosting plan for the web app
- **App Service**: Web application with staging slot
- **Azure SQL Server & Database**: Data storage
- **Storage Account**: Blob storage for assets
- **Key Vault**: Secrets management
- **Application Insights**: Monitoring and logging

## Next Steps

1. Configure Azure AD App Registration with redirect URIs
2. Update connection strings in Key Vault if needed
3. Deploy application code to App Service
4. Configure Private Endpoints (optional, for production)

## Private Endpoints (Optional)

For production, consider adding Private Endpoints for:
- SQL Database
- Storage Account
- App Service

This requires a VNet and subnet configuration.

