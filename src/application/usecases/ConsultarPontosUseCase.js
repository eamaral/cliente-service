const ClienteRepository = require('../../domain/repositories/ClienteRepository');

class ConsultarPontosUseCase {
  constructor() {
    this.repo = new ClienteRepository();
  }
  async execute(cpf) {
    if (!cpf) throw new Error('CPF é obrigatório.');
    const cli = await this.repo.findByCPF(cpf);
    if (!cli) throw new Error('Cliente não encontrado.');
    return { nome: cli.nome, pontos: cli.pontos };
  }
}

module.exports = ConsultarPontosUseCase;
