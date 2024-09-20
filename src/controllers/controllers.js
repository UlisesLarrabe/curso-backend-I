import { createResponse } from "../utils/createResponse.js";

export default class Controllers {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const items = await this.service.getAll();
      createResponse(res, 200, items);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) return createResponse(res, 404, "Item not found");
      createResponse(res, 200, item);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const obj = req.body;
      const item = await this.service.create(obj);
      createResponse(res, 201, item);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const obj = req.body;
      const item = await this.service.update(id, obj);
      createResponse(res, 200, item);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.delete(id);
      createResponse(res, 200, item);
    } catch (error) {
      next(error);
    }
  };
}
