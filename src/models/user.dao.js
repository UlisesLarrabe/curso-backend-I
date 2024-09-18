import MongoDao from "./dao.js";
import UserModel from "./user.model.js";

export default class UserAccessMongo extends MongoDao {
  constructor() {
    super(UserModel);
  }

  async getByEmail(email) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(error);
    }
  }
}
