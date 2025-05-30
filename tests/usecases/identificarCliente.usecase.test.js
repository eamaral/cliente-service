const IdentificarClienteUseCase = require('../../src/application/usecases/IdentificarClienteUseCase');

jest.mock('../../src/domain/repositories/ClienteRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findByCPF: jest.fn(cpf => cpf === '12345678900' ? { id: cpf, nome: 'Teste' } : null)
  }));
});

const ClienteRepository = require('../../src/domain/repositories/ClienteRepository');

describe('IdentificarClienteUseCase', () => {
  it('deve retornar cliente válido pelo CPF', async () => {
    const useCase = new IdentificarClienteUseCase(new ClienteRepository());
    const result = await useCase.execute('12345678900');
    expect(result.nome).toBe('Teste');
  });

  it('deve lançar erro se CPF for vazio', async () => {
    const useCase = new IdentificarClienteUseCase(new ClienteRepository());
    await expect(useCase.execute('')).rejects.toThrow('CPF é obrigatório');
  });

  it('deve lançar erro se cliente não for encontrado', async () => {
    const useCase = new IdentificarClienteUseCase(new ClienteRepository());
    await expect(useCase.execute('00000000000')).rejects.toThrow('Cliente não encontrado');
  });
});
