const ClienteRepository = require('../../domain/repositories/ClienteRepository');
const ClienteDto = require('../dtos/ClienteDto');

class IdentificarClienteUseCase {
  constructor() {
    this.repo = new ClienteRepository();
  }
  async execute(cpf) {
    if (!cpf) throw new Error('CPF é obrigatório.');
    const cli = await this.repo.findByCPF(cpf);
    if (!cli) throw new Error('Cliente não encontrado.');
    return new ClienteDto(cli);
  }
}

module.exports = IdentificarClienteUseCase;
