class AtualizarPontosUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(cpf) {
    const cliente = await this.clienteRepository.findByCPF(cpf);
    if (!cliente) throw new Error('Cliente não encontrado');

    cliente.pontos = (cliente.pontos || 0) + 1;
    let zerado = false;

    if (cliente.pontos >= 100) {
      cliente.pontos = 0;
      zerado = true;
    }

    await cliente.save();
    return { pontos: cliente.pontos, zerado };
  }
}

module.exports = AtualizarPontosUseCase;
