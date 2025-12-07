# Azure AD Configuratie Gids

Deze gids helpt je stap-voor-stap met het configureren van Azure AD voor het Azure Portal Shell project.

## Stap 1: Azure AD App Registration Aanmaken

### 1.1 Ga naar Azure Portal

1. Open [Azure Portal](https://portal.azure.com)
2. Log in met je Azure AD account
3. Zoek naar "Azure Active Directory" of "Microsoft Entra ID"
4. Klik op "App registrations" in het linker menu

### 1.2 Nieuwe App Registration Registreren

1. Klik op "+ New registration" (of "+ Nieuwe registratie")
2. Vul het formulier in:
   - **Name**: `Azure Portal Shell` (of een andere naam)
   - **Supported account types**: 
     - Selecteer: `Accounts in this organizational directory only (Single tenant)`
     - Dit betekent alleen accounts binnen jouw organisatie
   - **Redirect URI**:
     - Platform: Selecteer `Single-page application (SPA)`
     - URI: `http://localhost:3000`
3. Klik op "Register"

### 1.3 Belangrijke Waarden Kopiëren

Na het registreren zie je de "Overview" pagina. Kopieer deze waarden:

- **Application (client) ID** - Dit is je `ClientId`
- **Directory (tenant) ID** - Dit is je `TenantId`

⚠️ **BELANGRIJK**: Sla deze waarden op, je hebt ze nodig voor de configuratie!

## Stap 2: API Permissions Configureren

### 2.1 Microsoft Graph Permissions Toevoegen

1. In je App Registration, ga naar "API permissions" (of "API-machtigingen")
2. Klik op "+ Add a permission"
3. Selecteer "Microsoft Graph"
4. Selecteer "Delegated permissions"
5. Zoek en selecteer:
   - `User.Read` - Om basis gebruikersinformatie te lezen
6. Klik op "Add permissions"

### 2.2 Admin Consent Verlenen

1. Klik op "Grant admin consent for [jouw organisatie]"
2. Bevestig met "Yes"
3. De status zou nu "Granted for [organisatie]" moeten zijn

## Stap 3: API Exponeren (Voor Backend Authenticatie)

### 3.1 Application ID URI Instellen

1. Ga naar "Expose an API" (of "API blootstellen")
2. Klik op "Set" naast "Application ID URI"
3. Accepteer de standaard waarde of pas aan (bijv. `api://jouw-client-id`)
4. Klik op "Save"
5. **Kopieer de Application ID URI** - Dit is je `Audience` waarde

### 3.2 Scope Toevoegen (Optioneel maar Aanbevolen)

1. Klik op "+ Add a scope"
2. Vul in:
   - **Scope name**: `access_as_user`
   - **Who can consent?**: `Admins and users`
   - **Admin consent display name**: `Access Azure Portal Shell API`
   - **Admin consent description**: `Allow the application to access Azure Portal Shell API on behalf of the signed-in user`
   - **User consent display name**: `Access Azure Portal Shell API`
   - **User consent description**: `Allow the application to access Azure Portal Shell API on your behalf`
   - **State**: `Enabled`
3. Klik op "Add scope"

## Stap 4: Frontend Configuratie

### 4.1 .env.local Bestand Updaten

Open `frontend/.env.local` en vervang de placeholder waarden:

```env
# Azure AD Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=<jouw-client-id-hier>
NEXT_PUBLIC_AZURE_TENANT_ID=<jouw-tenant-id-hier>
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/<jouw-tenant-id-hier>
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Voorbeeld:**
```env
NEXT_PUBLIC_AZURE_CLIENT_ID=12345678-1234-1234-1234-123456789abc
NEXT_PUBLIC_AZURE_TENANT_ID=87654321-4321-4321-4321-cba987654321
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/87654321-4321-4321-4321-cba987654321
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Stap 5: Backend Configuratie

### 5.1 appsettings.json Updaten

Open `backend/appsettings.json` en update de `AzureAd` sectie:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "<jouw-tenant-id>",
    "TenantId": "<jouw-tenant-id>",
    "ClientId": "<jouw-client-id>",
    "Audience": "api://<jouw-client-id>"
  }
}
```

**Voorbeeld:**
```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "87654321-4321-4321-4321-cba987654321",
    "TenantId": "87654321-4321-4321-4321-cba987654321",
    "ClientId": "12345678-1234-1234-1234-123456789abc",
    "Audience": "api://12345678-1234-1234-1234-123456789abc"
  }
}
```

⚠️ **BELANGRIJK**: 
- `Audience` moet exact overeenkomen met de Application ID URI uit Stap 3.1
- Gebruik dezelfde `ClientId` in zowel frontend als backend

## Stap 6: Services Herstarten

Na het updaten van de configuratie, herstart beide services:

1. Stop de huidige backend en frontend (sluit de PowerShell vensters)
2. Start opnieuw:
   ```powershell
   # Terminal 1 - Backend
   cd backend
   dotnet run
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Stap 7: Testen

1. Open http://localhost:3000 in je browser
2. Klik op "Sign In"
3. Je zou nu een Microsoft login pagina moeten zien
4. Log in met je Azure AD account
5. Na succesvolle login zou je de portal moeten zien!

## Troubleshooting

### "AADSTS50011: The redirect URI specified does not match"
- Controleer of de redirect URI in Azure AD exact overeenkomt: `http://localhost:3000`
- Zorg dat er geen trailing slash is
- Controleer `NEXT_PUBLIC_REDIRECT_URI` in `.env.local`

### "AADSTS7000215: Invalid client secret"
- Voor SPA apps heb je geen client secret nodig
- Controleer of je de juiste `ClientId` gebruikt

### "401 Unauthorized" bij API calls
- Controleer of `Audience` in backend exact overeenkomt met Application ID URI
- Controleer of de token de juiste scope heeft (`access_as_user`)

### "CORS error"
- Controleer of `Frontend:Url` in `appsettings.json` correct is
- Zorg dat beide services draaien

## Veiligheid

- ⚠️ **Gebruik NOOIT productie credentials in development**
- ⚠️ **Voeg `.env.local` toe aan `.gitignore`** (zou al moeten staan)
- ⚠️ **Deel NOOIT je Client ID of Tenant ID publiekelijk**

## Volgende Stappen

- Configureer productie redirect URIs voor deployment
- Setup rollen en permissions voor admin functionaliteit
- Configureer extra scopes indien nodig


