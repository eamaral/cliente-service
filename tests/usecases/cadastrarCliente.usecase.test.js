const CadastrarClienteUseCase = require('../../src/application/usecases/CadastrarClienteUseCase');

describe('CadastrarClienteUseCase', () => {
    const mockRepo = {
        findByCPF: jest.fn(),
        create: jest.fn()
    };

    const usecase = new CadastrarClienteUseCase(mockRepo);

    it('deve cadastrar um novo cliente se CPF não existir', async () => {
        mockRepo.findByCPF.mockResolvedValue(null);
        mockRepo.create.mockResolvedValue({ id: '123', nome: 'Erik' });

        const result = await usecase.execute({
            cpf: '123',
            nome: 'Erik',
            email: 'erik@mail.com',
            telefone: '11999999999'
        });

        expect(mockRepo.create).toHaveBeenCalled();
        expect(result.nome).toBe('Erik');
    });

    it('deve lançar erro se CPF já estiver cadastrado', async () => {
        mockRepo.findByCPF.mockResolvedValue({ id: '123' });

        await expect(usecase.execute({
            cpf: '123',
            nome: 'Erik',
            email: 'erik@mail.com',
            telefone: '11999999999'
        })).rejects.toThrow('Cliente já cadastrado');
    });

    it('deve lançar erro se dados obrigatórios estiverem faltando', async () => {
        await expect(usecase.execute({
            cpf: '', nome: '', email: '', telefone: ''
        })).rejects.toThrow('Todos os campos são obrigatórios');
    });
});
