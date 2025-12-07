# PowerShell script om Azure AD configuratie in te stellen
# Gebruik: .\configure-azure-ad.ps1

Write-Host "🔐 Azure AD Configuratie Helper" -ForegroundColor Cyan
Write-Host ""

# Vraag om de Azure AD waarden
Write-Host "Voer de volgende waarden in van je Azure AD App Registration:" -ForegroundColor Yellow
Write-Host ""

$clientId = Read-Host "Application (Client) ID"
$tenantId = Read-Host "Directory (Tenant) ID"

Write-Host ""
Write-Host "Voor de Audience, gebruik je meestal: api://$clientId" -ForegroundColor Gray
$audience = Read-Host "Audience (Application ID URI) [api://$clientId]"
if ([string]::IsNullOrWhiteSpace($audience)) {
    $audience = "api://$clientId"
}

Write-Host ""
Write-Host "Configuratie wordt bijgewerkt..." -ForegroundColor Green

# Update frontend .env.local
$frontendEnvPath = "frontend\.env.local"
$frontendEnvContent = @"
# Azure AD Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=$clientId
NEXT_PUBLIC_AZURE_TENANT_ID=$tenantId
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/$tenantId
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
"@

try {
    $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding utf8 -Force
    Write-Host "✅ Frontend .env.local bijgewerkt" -ForegroundColor Green
} catch {
    Write-Host "❌ Fout bij updaten frontend .env.local: $_" -ForegroundColor Red
}

# Update backend appsettings.json
$backendConfigPath = "backend\appsettings.json"
try {
    $backendConfig = Get-Content $backendConfigPath -Raw | ConvertFrom-Json
    
    $backendConfig.AzureAd.Domain = $tenantId
    $backendConfig.AzureAd.TenantId = $tenantId
    $backendConfig.AzureAd.ClientId = $clientId
    $backendConfig.AzureAd.Audience = $audience
    
    $backendConfig | ConvertTo-Json -Depth 10 | Set-Content $backendConfigPath -Encoding utf8
    Write-Host "✅ Backend appsettings.json bijgewerkt" -ForegroundColor Green
} catch {
    Write-Host "❌ Fout bij updaten backend appsettings.json: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Configuratie voltooid!" -ForegroundColor Green
Write-Host ""
Write-Host "Volgende stappen:" -ForegroundColor Yellow
Write-Host "1. Herstart de backend en frontend services" -ForegroundColor Gray
Write-Host "2. Test de login op http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Zorg ervoor dat in Azure AD:" -ForegroundColor Yellow
Write-Host "- Redirect URI is ingesteld op: http://localhost:3000" -ForegroundColor Gray
Write-Host "- User.Read permission is toegevoegd en admin consent is gegeven" -ForegroundColor Gray
Write-Host "- Application ID URI is ingesteld op: $audience" -ForegroundColor Gray
Write-Host ""


