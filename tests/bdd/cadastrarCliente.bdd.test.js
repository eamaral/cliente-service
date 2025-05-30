const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('./tests/bdd/cadastrarCliente.feature');
const CadastrarClienteUseCase = require('../../src/application/usecases/CadastrarClienteUseCase');

defineFeature(feature, test => {
  let usecase, mockRepo, resultado;

  beforeEach(() => {
    mockRepo = {
      findByCPF: jest.fn(),
      create: jest.fn()
    };
    usecase = new CadastrarClienteUseCase(mockRepo);
  });

  test('Cliente se cadastra com sucesso', ({ given, when, then }) => {
    given(/^um novo cliente com CPF "([^"]*)"$/, (cpf) => {
      mockRepo.findByCPF.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: cpf, nome: 'Erik' });
    });

    when('eu executo o cadastro', async () => {
      resultado = await usecase.execute({
        cpf: '123',
        nome: 'Erik',
        email: 'erik@mail.com',
        telefone: '11999999999'
      });
    });

    then('o cliente deve ser salvo com sucesso', () => {
      expect(resultado.nome).toBe('Erik');
    });
  });
});
