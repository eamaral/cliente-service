const CadastrarClienteUseCase    = require('../usecases/CadastrarClienteUseCase');
const IdentificarClienteUseCase  = require('../usecases/IdentificarClienteUseCase');
const ConsultarPontosUseCase     = require('../usecases/ConsultarPontosUseCase');
const AtualizarPontosUseCase     = require('../usecases/AtualizarPontosUseCase');

const ClienteRepository          = require('../../domain/repositories/ClienteRepository');
const ClienteDto                 = require('../dtos/ClienteDto');

const clienteRepo   = new ClienteRepository();
const cadastrarUC   = new CadastrarClienteUseCase();
const identificarUC = new IdentificarClienteUseCase();
const consultarUC   = new ConsultarPontosUseCase();
const atualizarUC   = new AtualizarPontosUseCase(clienteRepo);

module.exports = {
  cadastrarCliente: async (req, res) => {
    try {
      const cliente = await cadastrarUC.execute(req.body);
      return res.status(201).json(new ClienteDto(cliente));
    } catch (e) {
      const status = e.message.includes('Todos os campos') || e.message.includes('já cadastrado') ? 400 : 500;
      return res.status(status).json({ error: e.message });
    }
  },

  identificarCliente: async (req, res) => {
    try {
      const cliente = await identificarUC.execute(req.params.cpf);
      return res.status(200).json(new ClienteDto(cliente));
    } catch (e) {
      const status = e.message.includes('obrigatório') ? 400 :
                     e.message.includes('não encontrado') ? 404 : 500;
      return res.status(status).json({ error: e.message });
    }
  },

  consultarPontos: async (req, res) => {
    try {
      const resultado = await consultarUC.execute(req.params.cpf);
      return res.status(200).json(resultado);
    } catch (e) {
      const status = e.message.includes('obrigatório') ? 400 :
                     e.message.includes('não encontrado') ? 404 : 500;
      return res.status(status).json({ error: e.message });
    }
  },

  atualizarPontos: async (req, res) => {
    try {
      const { cpf } = req.params;
      const resultado = await atualizarUC.execute(cpf);
      return res.status(200).json(resultado);
    } catch (e) {
      const status = e.message.includes('Cliente não encontrado') ? 404 : 500;
      console.error('Erro ao atualizar pontos:', e);
      return res.status(status).json({ error: e.message });
    }
  }
};
