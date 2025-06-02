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

const baseUrl = process.env.API_BASE_URL?.trim() || '';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Cliente Service API',
      version: '1.0.0',
      description: 'Microserviços de Cliente com Auth via Cognito',
    },
    servers: [
      { url: `${baseUrl}`, description: 'API Swagger' }
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

// Rotas públicas
app.use(`${apiPrefix}/auth`, require('./src/interfaces/http/routes/authRoutes'));

// Middleware de autenticação
const verifyToken = require('./src/interfaces/http/middlewares/verifyToken');

// Rotas protegidas
app.use(`${apiPrefix}/clientes`, verifyToken, require('./src/interfaces/http/routes/clienteRoutes'));

// Health Check
app.get('/health', (_req, res) => res.status(200).send('OK'));

console.log('🧩 Rotas registradas:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path);
      }
    });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Cliente Service rodando na porta ${PORT}`);
});
