# Contributing Guide

Thank you for your interest in contributing to the Azure Employee Portal project!

## Development Workflow

1. Create a feature branch from `dev`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Ensure code quality:
   - Run linters (both frontend and backend)
   - Write/update tests
   - Update documentation if needed

4. Commit your changes with clear messages
   ```bash
   git commit -m "feat: add drag-and-drop tile reordering"
   ```

5. Push and create a Pull Request to `dev` branch

## Code Style

### Frontend (TypeScript/React)

- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use Tailwind CSS utility classes
- Keep components small and focused
- Use meaningful variable and function names

### Backend (C#/.NET)

- Follow C# coding conventions
- Use async/await for I/O operations
- Keep controllers thin, business logic in services
- Use dependency injection
- Add XML documentation comments for public APIs

## Testing

### Frontend

```bash
cd frontend
npm test
```

### Backend

```bash
cd backend
dotnet test
```

## Commit Message Convention

We use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Request review from maintainers
4. Address review feedback
5. Squash commits if requested
6. Merge to `dev` after approval

## Questions?

Please open an issue for questions or discussions.

