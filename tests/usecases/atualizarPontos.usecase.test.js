const AtualizarPontosUseCase = require('../../src/application/usecases/AtualizarPontosUseCase');

describe('AtualizarPontosUseCase', () => {
  it('deve adicionar 1 ponto ao cliente se tiver menos de 100 pontos', async () => {
    const cliente = {
      pontos: 50,
      save: jest.fn().mockResolvedValue()
    };

    const mockRepo = {
      findByCPF: jest.fn().mockResolvedValue(cliente)
    };

    const useCase = new AtualizarPontosUseCase(mockRepo);
    const result = await useCase.execute('12345678900');

    expect(result).toEqual({ pontos: 51, zerado: false });
    expect(cliente.save).toHaveBeenCalled();
  });

  it('deve zerar pontos se atingir 100 ou mais', async () => {
    const cliente = {
      pontos: 99,
      save: jest.fn().mockResolvedValue()
    };

    const mockRepo = {
      findByCPF: jest.fn().mockResolvedValue(cliente)
    };

    const useCase = new AtualizarPontosUseCase(mockRepo);
    const result = await useCase.execute('12345678900');

    expect(result).toEqual({ pontos: 0, zerado: true });
    expect(cliente.save).toHaveBeenCalled();
  });

  it('deve lançar erro se cliente não for encontrado', async () => {
    const mockRepo = {
      findByCPF: jest.fn().mockResolvedValue(null)
    };

    const useCase = new AtualizarPontosUseCase(mockRepo);

    await expect(useCase.execute('12345678900')).rejects.toThrow('Cliente não encontrado');
  });
});
