export default class Services {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async create(obj) {
    return await this.dao.create(obj);
  }

  async update(id, obj) {
    return await this.dao.update(id, obj);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}
