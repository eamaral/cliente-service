// src/infrastructure/database/sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL conectado.');
  } catch (err) {
    console.error('❌ Falha ao conectar MySQL:', err.message);
    process.exit(1);
  }
};

// Sincroniza no dev
sequelize.sync({ alter: true });

module.exports = { sequelize, connectDB };
