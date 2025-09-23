# Seedify Backend Server

A pure Express.js backend server for the Seedify application.

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server with hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Production

```bash
# Build the server
pnpm build

# Start the production server
pnpm start

# Clean build artifacts
pnpm clean
```

## API Endpoints

### Health Check
- `GET /api/health` - Returns server health status with uptime and environment info
- `GET /api/status` - Simple status check

## Configuration

The server runs on port 3001 by default to avoid conflicts with the frontend (which typically runs on port 3000).

### CORS
CORS is configured to allow requests from:
- `http://localhost:3000` (frontend)
- `http://localhost:3001` (backend itself)

### Security
- Helmet.js for security headers
- Morgan for request logging
- CORS protection
- Body parsing with size limits

## Project Structure

```
backend/
├── server.ts              # Server entry point
├── src/
│   ├── app.ts             # Express app configuration
│   ├── config/
│   │   └── index.ts       # Configuration settings
│   ├── controllers/       # Route controllers
│   │   ├── healthController.ts
│   │   └── statusController.ts
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── routes/            # API routes
│   │   ├── health.ts
│   │   └── status.ts
│   ├── services/          # Business logic services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
│       └── api-utils.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Adding New API Endpoints

### 1. Create a Route File
Create a new file in `src/routes/`:

```typescript
// src/routes/users.ts
import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
```

### 2. Create a Controller
Create the corresponding controller in `src/controllers/`:

```typescript
// src/controllers/userController.ts
import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  },

  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to create user' });
    }
  }
};
```

### 3. Add Route to App
Import and use the route in `src/app.ts`:

```typescript
import userRoutes from './routes/users';

// Add after other routes
app.use('/api/users', userRoutes);
```

## Server Features

- **Express.js** - Pure backend server with no frontend dependencies
- **TypeScript** - Full type safety with proper backend configuration
- **Modular Architecture** - Controllers, Routes, Services, Middleware separation
- **Hot Reload** - Development server with tsx watch
- **Security** - Helmet, CORS, and request logging
- **Error Handling** - Centralized error handling middleware
- **Production Ready** - Build scripts and deployment configuration