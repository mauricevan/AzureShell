# Azure Portal Shell - Frontend

Next.js frontend application for the Azure Employee Portal.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **MSAL.js** - Microsoft Authentication Library for Azure AD
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Configuration

1. Copy `.env.local.example` to `.env.local`
2. Update with your Azure AD configuration:
   - `NEXT_PUBLIC_AZURE_CLIENT_ID` - Azure AD App Registration Client ID
   - `NEXT_PUBLIC_AZURE_TENANT_ID` - Azure AD Tenant ID
   - `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5000)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Project Structure

```
frontend/
├── app/              # Next.js App Router pages
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   └── globals.css  # Global styles
├── components/       # React components
│   ├── TileGrid.tsx
│   ├── TileCard.tsx
│   └── AddTileButton.tsx
└── lib/             # Utilities
    ├── msalConfig.ts # MSAL configuration
    └── api.ts       # API client
```

## Features

- Azure AD SSO authentication
- Tile grid with drag-and-drop (future)
- Add/remove tiles
- Personal tile customization
- Responsive design

