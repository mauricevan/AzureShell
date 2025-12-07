# Quick Start Guide

Get the Azure Employee Portal up and running in 10 minutes.

## Prerequisites Check

- [ ] Azure subscription
- [ ] Azure AD tenant access
- [ ] Node.js 18+ installed (`node --version`)
- [ ] .NET 7 SDK installed (`dotnet --version`)
- [ ] Azure CLI installed (`az --version`)

## Step 1: Azure AD Setup (5 minutes)

1. Go to [Azure Portal](https://portal.azure.com) > Azure Active Directory > App registrations
2. Click "New registration"
3. Name: `Azure Portal Shell`
4. Supported account types: `Accounts in this organizational directory only`
5. Redirect URI: Platform `Single-page application`, URI `http://localhost:3000`
6. Click "Register"
7. Copy **Application (client) ID** and **Directory (tenant) ID**

8. Go to "API permissions" > "Add a permission" > "Microsoft Graph" > "Delegated permissions"
   - Select `User.Read`
   - Click "Add permissions"
   - Click "Grant admin consent"

9. Go to "Expose an API"
   - Click "Set" next to Application ID URI
   - Save the Application ID URI (format: `api://your-client-id`)

## Step 2: Frontend Setup (2 minutes)

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your Azure AD values
npm install
npm run dev
```

Update `.env.local`:
```
NEXT_PUBLIC_AZURE_CLIENT_ID=<your-client-id>
NEXT_PUBLIC_AZURE_TENANT_ID=<your-tenant-id>
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id>
```

Frontend should now be running at http://localhost:3000

## Step 3: Backend Setup (2 minutes)

```bash
cd backend
```

Update `appsettings.json`:
```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<your-tenant-id>",
    "ClientId": "<your-client-id>",
    "Audience": "api://<your-client-id>"
  }
}
```

```bash
dotnet restore
dotnet run
```

Backend should now be running at http://localhost:5000

## Step 4: Test (1 minute)

1. Open http://localhost:3000
2. Click "Sign In"
3. Authenticate with your Azure AD account
4. You should see the portal with default tiles!

## Next Steps

- Add custom tiles via Admin API
- Deploy to Azure using infrastructure templates
- Configure CI/CD pipelines
- Set up monitoring

## Troubleshooting

**Can't sign in?**
- Check redirect URI in Azure AD matches exactly: `http://localhost:3000`
- Verify Client ID and Tenant ID in `.env.local`

**API errors?**
- Check backend is running on port 5000
- Verify CORS settings in `appsettings.json`
- Check Azure AD Audience matches Application ID URI

**Database errors?**
- Ensure SQL Server LocalDB is installed
- Check connection string in `appsettings.json`

For more help, see [SETUP.md](docs/SETUP.md)

