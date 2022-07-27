import { Users } from "../models/user.model.js";
import { logger } from "../utils/logger.js";

class AuthRepository {
  async create({ firstName, lastName, email, password, dateOfBirth, role }) {
    logger.info(`AuthRepository. Got create User request`);
    const user = new Users({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      role,
    });
    return user.save();
  }
  async findOneByEmail(email) {
    logger.info(`AuthRepository. FindOneByEmail request`);
    return Users.findOne({ email });
  }
  async findOneById(id) {
    logger.info(`AuthRepository. findOneById request ${id}`);
    return Users.findOne({ _id: id });
  }
}

export const authRepository = new AuthRepository();
