# Personal Task Manager API

Welcome to the Personal Task Manager API project! This API allows users to manage tasks by performing CRUD (Create, Read, Update, Delete) operations.

## Project Setup

To set up the project, follow these steps:

1. Clone the repository to your local machine:
git clone <repository-url>


2. Navigate to the project directory:
cd <project-directory>

3. Install dependencies using npm:
npm install



## Dependencies

This project relies on the following dependencies:

- Express.js: A minimal and flexible Node.js web application framework.
- Mongoose: A MongoDB object modeling tool designed to work in an asynchronous environment.
- bcrypt: A library for hashing passwords.
- jsonwebtoken: A library to generate and verify JWTs (JSON Web Tokens).

## Running the API

To run the API, execute the following command in your terminal:

npm start


This command starts the server, and the API will be accessible at the specified endpoints.
The server will be running at http://localhost:3000.

## Configuration

Before running the API, you need to configure the MongoDB connection. Open the `config/config.env` file and set the `MONGO_URI` variable to your MongoDB connection URI.

MONGO_URI=mongodb://localhost:27017/taskmanager


You can also configure other variables in this file such as `JWT_SECRET` for JWT token generation.

## API Endpoints

The following endpoints are available:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login with username and password to obtain JWT token.
- `GET /api/tasks`: Get all tasks.
- `POST /api/tasks`: Create a new task.
- `GET /api/tasks/:id`: Get a specific task by ID.
- `PUT /api/tasks/:id`: Update a task by ID.
- `DELETE /api/tasks/:id`: Delete a task by ID.
- `PATCH /api/tasks/:id/title`: Update the title of a task by ID.
- `PATCH /api/users/:id/email`: Update the email of a user by ID.
- `PATCH /api/categories/:id/name`: Update the name of a category by ID.

## Usage

After setting up and running the API, you can interact with it using HTTP requests. You can use tools like Postman or cURL to send requests to the defined endpoints.

Ensure you include the necessary authentication token in the request headers for routes that require authentication. The token can be obtained by logging in with valid credentials and obtaining the JWT token from the login response.

## Testing

You can use tools like Postman to test the API endpoints. Be sure to go through the authentication process to get the JWT token before accessing protected routes.