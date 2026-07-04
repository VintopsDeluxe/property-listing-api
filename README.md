# Nobzo Property API

A RESTful API for a simple property platform allowing users to create accounts, manage property listings, and save their favorite properties. Built with Node.js, Express, and MongoDB.

## Project Setup Instructions

### Prerequisites
* Node.js installed
* MongoDB instance (Local or Atlas)
* Git

### Installation Steps
1. Clone the repository:
   \`git clone <your-repository-url>\`
2. Navigate into the project directory:
   \`cd <project-folder>\`
3. Install the required dependencies:
   \`npm install\`

### Required Environment Variables
Create a \`.env\` file in the root directory. Refer to the \`.env.example\` file for the required variables:
* \`PORT\`: The port the server will run on (e.g., 3000)
* \`MONGO_URI\`: Your MongoDB connection string
* \`JWT_SECRET\`: A secure secret key for signing JSON Web Tokens

### How to Run the Application
Start the development server:
\`npm start\` (or \`node app.js\`)
The server will start on the configured port. 

### How to Test the API
1. **Swagger Documentation**: Once the server is running, navigate to \`http://localhost:3000/api-docs\` in your browser to interact with the endpoints directly.
2. **Postman**: Import the provided Postman collection file (\`Nobzo_Property_API.postman_collection.json\`) into your Postman workspace to execute pre-configured requests for all modules. Ensure you add your JWT token to the Authorization header for protected routes.
3.