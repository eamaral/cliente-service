class ClienteDto {
    constructor({ id, nome, email, telefone, pontos }) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
      this.pontos = pontos;
    }
  }
  
  module.exports = ClienteDto;
  