# Lokale Setup Gids

Deze gids helpt je om het Azure Portal Shell project lokaal te draaien voor testen.

## Vereisten

✅ **Gecontroleerd:**
- Node.js v22.14.0 ✓
- .NET SDK 7.0.400 ✓

**Nog nodig:**
- SQL Server LocalDB (meestal al geïnstalleerd met Visual Studio)
- Azure AD App Registration (voor authenticatie)

## Stap 1: Frontend Dependencies Installeren

```powershell
cd frontend
npm install
```

## Stap 2: Backend Dependencies Installeren

```powershell
cd backend
dotnet restore
```

## Stap 3: Environment Variabelen Configureren

### Frontend (.env.local)

Maak een bestand `frontend/.env.local` met de volgende inhoud:

```env
# Azure AD Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id-here
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Let op:** Vervang `your-client-id-here` en `your-tenant-id-here` met je eigen Azure AD waarden.

### Backend (appsettings.json)

Update `backend/appsettings.json` met je Azure AD configuratie:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "your-tenant-id",
    "TenantId": "your-tenant-id",
    "ClientId": "your-client-id",
    "Audience": "api://your-client-id"
  }
}
```

## Stap 4: Azure AD App Registration (Eerste Keer)

Als je nog geen Azure AD App Registration hebt:

1. Ga naar [Azure Portal](https://portal.azure.com) > Azure Active Directory > App registrations
2. Klik "New registration"
3. Naam: `Azure Portal Shell`
4. Supported account types: `Accounts in this organizational directory only`
5. Redirect URI: Platform `Single-page application`, URI `http://localhost:3000`
6. Klik "Register"
7. Kopieer de **Application (client) ID** en **Directory (tenant) ID**

8. Ga naar "API permissions" > "Add a permission" > "Microsoft Graph" > "Delegated permissions"
   - Selecteer `User.Read`
   - Klik "Add permissions"
   - Klik "Grant admin consent"

9. Ga naar "Expose an API"
   - Klik "Set" naast Application ID URI
   - Sla de Application ID URI op (format: `api://your-client-id`)

## Stap 5: Project Starten

### Optie 1: Gebruik het Start Script (Aanbevolen)

**Windows (PowerShell):**
```powershell
.\start-local.ps1
```

**Linux/Mac:**
```bash
chmod +x start-local.sh
./start-local.sh
```

### Optie 2: Handmatig Starten

**Terminal 1 - Backend:**
```powershell
cd backend
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Stap 6: Testen

1. Open je browser naar `http://localhost:3000`
2. Klik op "Sign In"
3. Authenticeer met je Azure AD account
4. Je zou nu de portal moeten zien met standaard tiles!

## Beschikbare Endpoints

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger (in development mode)

## Troubleshooting

### Database Problemen

Als je een database error krijgt:
- Controleer of SQL Server LocalDB geïnstalleerd is
- De database wordt automatisch aangemaakt bij de eerste run
- Check de connection string in `appsettings.json`

### Authenticatie Problemen

- Controleer of de redirect URI in Azure AD exact overeenkomt: `http://localhost:3000`
- Verifieer dat Client ID en Tenant ID correct zijn in beide configuratiebestanden
- Zorg dat de Audience in backend overeenkomt met de Application ID URI

### CORS Problemen

- Controleer of `Frontend:Url` in `appsettings.json` correct is ingesteld
- Zorg dat beide services draaien op de juiste poorten

### Port Al In Gebruik

Als poort 3000 of 5000 al in gebruik is:
- Frontend: Wijzig poort in `package.json` script of gebruik `npm run dev -- -p 3001`
- Backend: Wijzig poort in `launchSettings.json` of gebruik `dotnet run --urls "http://localhost:5001"`

## Volgende Stappen

- Voeg custom tiles toe via de Admin API
- Configureer productie deployment
- Setup CI/CD pipelines

