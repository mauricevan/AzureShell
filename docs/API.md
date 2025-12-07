# API Documentation

## Base URL

- Development: `http://localhost:5000`
- Production: `https://your-api.azurewebsites.net`

## Authentication

All API endpoints require Azure AD authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Users

#### GET /api/users/me

Get current authenticated user information.

**Response:**
```json
{
  "id": "user-guid",
  "email": "user@example.com",
  "displayName": "John Doe",
  "azureAdObjectId": "azure-ad-object-id"
}
```

### Tiles

#### GET /api/tiles/catalog

Get available tiles in the catalog.

**Response:**
```json
[
  {
    "id": "tile-guid",
    "name": "SharePoint",
    "url": "https://sharepoint.com",
    "icon": null,
    "type": "sharepoint"
  }
]
```

#### GET /api/users/{userId}/tiles

Get user's personalized tiles.

**Response:**
```json
[
  {
    "id": "tile-guid",
    "name": "SharePoint",
    "url": "https://sharepoint.com",
    "icon": null,
    "type": "sharepoint",
    "order": 0,
    "pinned": true
  }
]
```

#### POST /api/users/{userId}/tiles

Add a tile to user's collection.

**Request:**
```json
{
  "tileId": "tile-guid"
}
```

**Response:** 200 OK

#### DELETE /api/users/{userId}/tiles/{tileId}

Remove a tile from user's collection.

**Response:** 204 No Content

#### PUT /api/users/{userId}/tiles/{tileId}

Update tile order or pin status.

**Request:**
```json
{
  "order": 1,
  "pinned": true
}
```

**Response:** 200 OK

### Admin (Requires Admin Role)

#### GET /api/admin/tiles

Get all tiles (admin only).

**Response:**
```json
[
  {
    "tileId": "tile-guid",
    "name": "SharePoint",
    "type": "sharepoint",
    "url": "https://sharepoint.com",
    "iconRef": null,
    "allowedGroups": null,
    "tenantScoped": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/admin/tiles

Create a new tile (admin only).

**Request:**
```json
{
  "name": "New Tile",
  "type": "link",
  "url": "https://example.com",
  "iconRef": null,
  "allowedGroups": null,
  "tenantScoped": true
}
```

**Response:** 201 Created

#### PUT /api/admin/tiles/{tileId}

Update a tile (admin only).

**Request:** Same as POST

**Response:** 200 OK

#### DELETE /api/admin/tiles/{tileId}

Delete a tile (admin only).

**Response:** 204 No Content

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Token is missing or invalid"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "User does not have permission"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation error message"
}
```

