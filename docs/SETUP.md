# Setup Guide

This guide will help you set up the Azure Employee Portal for local development and deployment.

## Prerequisites

- Azure subscription with appropriate permissions
- Azure AD tenant
- Node.js 18+ and npm
- .NET 7 SDK
- Azure CLI installed and configured
- Git

## Step 1: Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com) > Azure Active Directory > App registrations
2. Click "New registration"
3. Name: "Azure Portal Shell"
4. Supported account types: "Accounts in this organizational directory only"
5. Redirect URI: 
   - Platform: Single-page application (SPA)
   - URI: `http://localhost:3000` (for local dev)
   - Add production URI later

6. Click "Register"
7. Note the **Application (client) ID** and **Directory (tenant) ID**

8. Go to "API permissions"
   - Add permission > Microsoft Graph > Delegated permissions
   - Select: `User.Read`
   - Click "Add permissions"
   - Click "Grant admin consent"

9. Go to "Expose an API"
   - Click "Set" next to Application ID URI
   - Accept the default or customize
   - Click "Add a scope"
     - Scope name: `access_as_user`
     - Who can consent: Admins and users
     - Admin consent display name: "Access Azure Portal Shell API"
     - Admin consent description: "Allow the application to access Azure Portal Shell API on behalf of the signed-in user"
     - Click "Add scope"

10. Go to "Certificates & secrets"
    - Optional: Create a client secret for server-to-server scenarios

## Step 2: Configure Frontend

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Azure AD values:
   ```
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-here
   NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id-here
   NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-here
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Step 3: Configure Backend

1. Update `appsettings.json`:
   ```json
   {
     "AzureAd": {
       "Instance": "https://login.microsoftonline.com/",
       "Domain": "your-tenant-id",
       "TenantId": "your-tenant-id",
       "ClientId": "your-client-id",
       "Audience": "api://your-client-id"
     },
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AzurePortalDB;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

2. Install .NET dependencies:
   ```bash
   cd backend
   dotnet restore
   ```

3. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` (or `http://localhost:5000`)

## Step 4: Deploy Infrastructure (Optional for Local Dev)

For local development, you can use LocalDB. For deploying to Azure:

1. Create resource group:
   ```bash
   az group create --name rg-azure-portal-shell-dev --location "West Europe"
   ```

2. Copy and update parameters:
   ```bash
   cd infrastructure
   cp parameters.json.example parameters.json
   # Edit parameters.json with your values
   ```

3. Deploy:
   ```bash
   az deployment group create \
     --resource-group rg-azure-portal-shell-dev \
     --template-file main.bicep \
     --parameters @parameters.json
   ```

4. Update backend `appsettings.json` with connection strings from Key Vault

## Step 5: Testing

1. Start both frontend and backend
2. Navigate to `http://localhost:3000`
3. Click "Sign In" and authenticate with Azure AD
4. You should see the portal with default tiles
5. Try adding/removing tiles

## Troubleshooting

### Authentication Issues

- Verify redirect URIs match exactly in Azure AD
- Check CORS settings in backend
- Ensure token scopes include `User.Read`

### Database Issues

- Ensure SQL Server LocalDB is installed
- Check connection string in `appsettings.json`
- Run migrations: `dotnet ef database update` (if using migrations)

### CORS Issues

- Update `appsettings.json` Frontend:Url
- Check backend CORS configuration in `Program.cs`

## Next Steps

- Set up CI/CD pipelines (GitHub Actions)
- Configure production environment
- Set up Private Endpoints for production
- Configure monitoring and alerts

