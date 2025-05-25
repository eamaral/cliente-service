const Cliente = require('../entities/Cliente');

class ClienteRepository {
  async findById(id) {
    return await Cliente.findByPk(id);
  }
  async findByCPF(cpf) {
    return await Cliente.findOne({ where: { id: cpf } });
  }
  async create(data) {
    return await Cliente.create(data);
  }
  async update(data) {
    await Cliente.update(data, { where: { id: data.id } });
    return this.findById(data.id);
  }
}

module.exports = ClienteRepository;
