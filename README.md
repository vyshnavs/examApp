# Exam App

## Overview
The Exam App is a web application designed to facilitate the creation, management, and taking of exams. It consists of a backend built with Node.js and Express, and a frontend developed using React.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **config/**: Contains configuration files, including database connection settings.
- **controllers/**: Contains the logic for handling requests related to admin, exams, and users.
- **middleware/**: Contains middleware functions for authentication and authorization.
- **models/**: Defines the data models for exams, questions, and users.
- **routes/**: Defines the API routes and links them to the corresponding controller functions.
- **.env**: Contains environment variables for the backend.
- **package.json**: Lists dependencies and scripts for the backend.
- **server.js**: The entry point for the backend application.
- **nodemon.json**: Configuration for Nodemon to watch for file changes.

### Frontend
- **public/**: Contains the main HTML file for the frontend application.
- **src/**: Contains the React components, pages, and styles for the frontend.
- **package.json**: Lists dependencies and scripts for the frontend.
- **.env**: Contains environment variables specific to the frontend.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the necessary environment variables.
4. Start the server:
   ```
   npm run dev
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend application:
   ```
   npm start
   ```

## Usage
- Access the frontend application in your web browser at `http://localhost:3000`.
- The backend API can be accessed at `http://localhost:5000/api`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.