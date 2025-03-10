# Quick Note About the Project
React-Auth-Backend is a backend project built with Node.js and Express.js. It serves as the backend for the React-Auth frontend application, which is built with React.js.

This project was developed to master best practices for managing JWT authentication, ensuring secure token handling between the backend and frontend (React.js/Next.js).

Both projects work together to implement a secure authentication system, including access and refresh tokens.

# Feel free, clone the repo and use it for your practice!!

# Important Environment Variables

To ensure the application works correctly, the following environment variables must be set:

## Server Configuration

- `PORT`: The port number on which the server will run. Example: `3501`
- `NODE_ENV`: The environment in which the app is running. Example: `development` or `production`

## Database Configuration

- `DB_URI`: The URI for connecting to the MongoDB database.

## Authentication & Security

- `ACCESS_TOKEN_SECRET`: The secret key for signing access tokens.
- `REFRESH_TOKEN_SECRET`: The secret key for signing refresh tokens.
- `JWT_ACCESS_TOKEN_SECRET`: The secret key for signing JWT access tokens.
- `JWT_ACCESS_TOKEN_EXPIRES_IN`: The expiration time for access tokens (e.g., `15m`).
- `JWT_REFRESH_TOKEN_SECRET`: The secret key for signing JWT refresh tokens.
- `JWT_REFRESH_TOKEN_EXPIRES_IN`: The expiration time for refresh tokens (e.g., `7d`).

## API Configuration

- `PROD_API_URL`: The production API URL (used in production environments). Example: `https://reactauthapp.com`
- `CLIENT_API_URL`: The client application URL. Example: `http://localhost:5173`

---

## Example `.env` File

**Note:** Ensure that these environment variables are kept secure and never exposed publicly.

