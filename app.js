import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { protect } from './middlewares/auth.js';
import { validateRequest } from './middlewares/validate.js';
import { authSchema, propertySchema, savedPropertySchema } from './utils/validationSchemas.js';

// Route Imports
import { register, login } from './controllers/authController.js';
import { createProperty, getProperties, getProperty } from './controllers/propertyController.js';
import { saveProperty, getSavedProperties, removeSavedProperty } from './controllers/savedPropertyController.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { 
            title: 'Nobzo Property API', 
            version: '1.0.0',
            description: 'RESTful API for a simple property platform'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./app.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: { type: string }
 * password: { type: string }
 * responses:
 * 201:
 * description: User registered successfully
 */
app.post('/api/auth/register', validateRequest(authSchema), register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: { type: string }
 * password: { type: string }
 * responses:
 * 200:
 * description: Returns JWT token
 */
app.post('/api/auth/login', validateRequest(authSchema), login);

/**
 * @swagger
 * /api/properties:
 * post:
 * summary: Create a property listing
 * tags: [Properties]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title: { type: string }
 * description: { type: string }
 * price: { type: number }
 * location: { type: string }
 * responses:
 * 201:
 * description: Property created
 * get:
 * summary: Get all properties
 * tags: [Properties]
 * parameters:
 * - in: query
 * name: page
 * schema: { type: integer }
 * - in: query
 * name: limit
 * schema: { type: integer }
 * - in: query
 * name: location
 * schema: { type: string }
 * responses:
 * 200:
 * description: List of properties
 */
app.post('/api/properties', protect, validateRequest(propertySchema), createProperty);
app.get('/api/properties', getProperties);

/**
 * @swagger
 * /api/properties/{id}:
 * get:
 * summary: Get a single property
 * tags: [Properties]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * responses:
 * 200:
 * description: Property details
 */
app.get('/api/properties/:id', getProperty);

/**
 * @swagger
 * /api/saved:
 * post:
 * summary: Save a property
 * tags: [Saved Properties]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * propertyId: { type: string }
 * responses:
 * 201:
 * description: Property saved
 * get:
 * summary: Get all saved properties for logged-in user
 * tags: [Saved Properties]
 * responses:
 * 200:
 * description: List of saved properties
 */
app.post('/api/saved', protect, validateRequest(savedPropertySchema), saveProperty);
app.get('/api/saved', protect, getSavedProperties);

/**
 * @swagger
 * /api/saved/{id}:
 * delete:
 * summary: Remove a saved property
 * tags: [Saved Properties]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * responses:
 * 200:
 * description: Property removed from saved list
 */
app.delete('/api/saved/:id', protect, removeSavedProperty);

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});