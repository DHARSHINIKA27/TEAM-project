# Enterprise IT Platform

Full-stack enterprise IT services platform with a React/Vite frontend, Express API backend, MongoDB persistence, and a Postman API collection.

## Project Structure

```text
enterprise-it-platform/
  backend/        Express API, MongoDB models, auth, and route handlers
  frontend/       React + Vite application
  postman/        API testing collection
```

## Prerequisites

- Node.js 20+
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `backend/.env` with your local values before starting the server.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend currently calls the API at `http://localhost:5000/api`.

## Environment Variables

See [backend/.env.example](backend/.env.example) for the required backend configuration.

## Useful Scripts

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## API Testing

Import [postman/api_collection.json](postman/api_collection.json) into Postman to test the backend endpoints.
