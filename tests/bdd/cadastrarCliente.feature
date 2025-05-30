Feature: Cadastro de Cliente

  Scenario: Cliente se cadastra com sucesso
    Given um novo cliente com CPF "123"
    When eu executo o cadastro
    Then o cliente deve ser salvo com sucesso
