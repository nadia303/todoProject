import { logger } from "../utils/logger.js";
import { Users } from "../models/user.model.js";
import { Todos } from "../models/todoMogo.model.js";

class AdminMongoRepository {
  //gets all existing users
  async getAllUsers({ limit, page, email }) {
    if (email) {
      const searchEmail = new RegExp(`.*${email}.*`);
      const users = await Users.find({
        email: { $regex: searchEmail, $options: "i" },
      })
        .skip(limit * page)
        .limit(limit);
      return users;
    }
    const users = await Users.find()
      .skip(limit * page)
      .limit(limit);
    return users;
  }

  //counts all existing users
  async getCount(email) {
    if (email) {
      const searchEmail = new RegExp(`.*${email}.*`);
      return Users.countDocuments({
        email: { $regex: searchEmail, $options: "i" },
      });
    }
    return Users.countDocuments();
  }

  //gets the user by id
  async getUserById(id) {
    return Users.findOne({ _id: id });
  }

  //deletes the user by id
  async deleteOneUser(id) {
    return Users.deleteOne({ _id: id });
  }

  //deletes one user all todos
  async deleteOneUserAllTodos(id) {
    return Todos.deleteMany({ owner: id });
  }

  //updates the user's data
  async updateUserData(id, userData) {
    logger.info(`AdminRepository. Update user data id=${id}`, { userData });
    return Users.findByIdAndUpdate(id, userData, { new: true });
  }
}

export const adminMongoRepository = new AdminMongoRepository();
