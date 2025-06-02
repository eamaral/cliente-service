const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  cadastrarCliente,
  identificarCliente,
  consultarPontos,
  atualizarPontos
} = require('../../../application/controllers/clienteController');

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gerenciamento de clientes
 */

/**
 * @swagger
 * /clientes/cadastrar:
 *   post:
 *     summary: Cadastrar novo cliente
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "34058799811"
 *               nome:
 *                 type: string
 *                 example: "Erik Amaral"
 *               email:
 *                 type: string
 *                 example: "erik.fernandes87@gmail.com"
 *               telefone:
 *                 type: string
 *                 example: "11987654321"
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso
 *       400:
 *         description: Erro ao cadastrar cliente
 */
router.post('/cadastrar', cadastrarCliente);

/**
 * @swagger
 * /clientes/identificar/{cpf}:
 *   get:
 *     summary: Identificar cliente via CPF
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         example: "34058799811"
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/identificar/:cpf', identificarCliente);

/**
 * @swagger
 * /clientes/pontos/{cpf}:
 *   get:
 *     summary: Consultar pontos acumulados do cliente
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         example: "34058799811"
 *     responses:
 *       200:
 *         description: Retorna o nome do cliente e seus pontos acumulados
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao consultar pontos do cliente
 */
router.get('/pontos/:cpf', consultarPontos);

/**
 * @swagger
 * /clientes/{cpf}:
 *   put:
 *     summary: Atualizar pontos do cliente após pedido finalizado
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         example: "34058799811"
 *     responses:
 *       200:
 *         description: Pontos atualizados com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao atualizar pontos
 */
router.put('/:cpf', atualizarPontos);

module.exports = router;
