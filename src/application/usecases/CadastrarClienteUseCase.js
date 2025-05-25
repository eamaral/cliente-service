const ClienteRepository = require('../../domain/repositories/ClienteRepository');

class CadastrarClienteUseCase {
  constructor() {
    this.clienteRepository = new ClienteRepository();
  }

  async execute(clienteData) {
    const { cpf, nome, email, telefone } = clienteData;

    // validação de campos obrigatórios
    if (!cpf || !nome || !email || !telefone) {
      throw new Error('Todos os campos são obrigatórios: CPF, nome, email e telefone.');
    }

    // verifica se já existe cliente com esse CPF
    const clienteExistente = await this.clienteRepository.findById(cpf);
    if (clienteExistente) {
      throw new Error('Cliente já cadastrado com este CPF.');
    }

    // cria e retorna o novo cliente
    const novoCliente = await this.clienteRepository.create({
      id: cpf,
      nome,
      email,
      telefone
    });
    return novoCliente;
  }
}

module.exports = CadastrarClienteUseCase;
