require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./src/infrastructure/database/sequelize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());

// Conexão com o banco
connectDB();

const apiPrefix = '/api';
const baseUrl   = process.env.API_BASE_URL || `http://localhost:4000`;

// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Cliente Service API',
      version: '1.0.0',
      description: 'Microserviços de Cliente com Auth via Cognito',
    },
    servers: [
      { url: baseUrl, description: 'Local (Docker)' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: [
    './src/interfaces/http/routes/authRoutes.js',
    './src/interfaces/http/routes/clienteRoutes.js'
  ]
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// Rotas Auth (não protegidas)
app.use(`${apiPrefix}/auth`, require('./src/interfaces/http/routes/authRoutes'));

// Middleware JWT
const verifyToken = require('./src/interfaces/http/middlewares/verifyToken');

// Rotas de Cliente (protegidas)
app.use(`${apiPrefix}/clientes`, verifyToken, require('./src/interfaces/http/routes/clienteRoutes'));


// Health
app.get('/', (_req, res) => res.send('API Gateway: Cliente Service'));
app.get('/health', (_req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Cliente Service rodando em http://localhost:${PORT}`);
  console.log(`📘 Swagger em        ${baseUrl}/api-docs`);
});
