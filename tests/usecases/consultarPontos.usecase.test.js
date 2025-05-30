const ConsultarPontosUseCase = require('../../src/application/usecases/ConsultarPontosUseCase');

jest.mock('../../src/domain/repositories/ClienteRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findByCPF: jest.fn(cpf => cpf === '12345678900' ? { nome: 'Teste', pontos: 50 } : null)
  }));
});

const ClienteRepository = require('../../src/domain/repositories/ClienteRepository');

describe('ConsultarPontosUseCase', () => {
  it('deve retornar nome e pontos', async () => {
    const useCase = new ConsultarPontosUseCase(new ClienteRepository());
    const result = await useCase.execute('12345678900');
    expect(result).toEqual({ nome: 'Teste', pontos: 50 });
  });

  it('deve lançar erro se CPF for vazio', async () => {
    const useCase = new ConsultarPontosUseCase(new ClienteRepository());
    await expect(useCase.execute('')).rejects.toThrow('CPF é obrigatório');
  });

  it('deve lançar erro se cliente não for encontrado', async () => {
    const useCase = new ConsultarPontosUseCase(new ClienteRepository());
    await expect(useCase.execute('00000000000')).rejects.toThrow('Cliente não encontrado');
  });
});
