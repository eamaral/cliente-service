const { DataTypes } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/sequelize');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pontos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;
