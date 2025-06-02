// ✅ index.js - DEFINITIVO (com prefixo fixo /api/auth e log de rotas visível)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./src/infrastructure/database/sequelize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());

connectDB();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Cliente Service API',
      version: '1.0.0',
      description: 'Microserviços de Cliente com Auth via Cognito',
    },
    servers: [
      { url: 'http://ms-shared-alb-1023094345.us-east-1.elb.amazonaws.com/api', description: 'API Swagger' }
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

app.use('/cliente-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));


// ✅ Rotas fixas para garantir /api/auth e /api/clientes
app.use('/api/auth', require('./src/interfaces/http/routes/authRoutes'));
const verifyToken = require('./src/interfaces/http/middlewares/verifyToken');
app.use('/api/clientes', verifyToken, require('./src/interfaces/http/routes/clienteRoutes'));

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Cliente Service rodando na porta ${PORT}`);
});
