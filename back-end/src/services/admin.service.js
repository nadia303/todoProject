// import { todoMongoRepository } from "../repositories/todoMongo.repository.js";
import { adminMongoRepository } from "../repositories/admin.repository.js";
import { todoMongoRepository } from "../repositories/todoMongo.repository.js";
import { HTTPError } from "../utils/HttpError.js";
import { logger } from "../utils/logger.js";
import { authService } from "./auth.service.js";

class AdminService {
  async addNewUser(user) {
    logger.info(`AdminService. Got create new user request`, { user });
    // return todoMongoRepository.create({ text, owner: user._id });
  }

  async getAllUsers({ limit = 10, page = 0 , email}) {
    page = page > 0 ? page : 0;
    logger.info(`AdminService. Got get ALL users request`, { limit, page });

    const [users, total] = await Promise.all([
      adminMongoRepository.getAllUsers({ limit, page, email}),
      adminMongoRepository.getCount(email),
    ]);
    return {
      data: users.map((user) => user.getPublickProfile()),
      limit,
      page: page + 1,
      total,
    };
  }

  async getUserById(id) {
    logger.info(`AdminService. Get user by id request ${id}`);
    const user = await adminMongoRepository.getUserById(id);
    return user.getPublickProfile();
  }

  async getAllTodos({ limit = 10, page = 0, text }, userId) {
    page = page > 0 ? page : 0;
    logger.info(`TodoService. Got get ALL todo request`, {
      limit,
      page,
    });
    const [todos, total] = await Promise.all([
      todoMongoRepository.getAll({ limit, page, text }, userId),
      todoMongoRepository.getCount(userId, text),
    ]);
    return {
      data: todos.map((todo) => todo.getPublickTodoWithUsers()),
      limit,
      page: page + 1,
      total,
    };
  }

  async updateUserData({ id, userData }) {
    logger.info(`AdminService. Got update user request ${id}`);
    const user = await adminMongoRepository.getUserById(id);
    if (!user) {
      logger.warn("AdminService. User not found");
      throw new HTTPError("Not found", 404);
    }
    logger.info(`AdminService. Got user from DB ${id}`);

    const { confirmPassword, password, ...otherData } = userData;

    if (confirmPassword) {
      if (password != confirmPassword) {
        throw new HTTPError("Confirm password are wrong", 400);
      }
      const hashedPassword = authService.getPasswordHash(password);
      userData = { ...otherData, password: hashedPassword };
    }
    const updatedUser = await adminMongoRepository.updateUserData(id, userData);
    logger.info(`AdminService. User updated ${id}`);

    return updatedUser.getPublickProfile();
  }

  async deleteOneUser(id) {
    const user = await adminMongoRepository.getUserById(id);
    if (!user) {
      logger.warn("Admin Service. User not found");
      throw new HTTPError("Not found", 404);
    }
    return adminMongoRepository.deleteOneUser(id);
  }

  async deleteOneUserAllTodos(id) {
    const user = await adminMongoRepository.getUserById(id);
    if (!user) {
      logger.warn("Admin Service. User not found");
      throw new HTTPError("Not found", 404);
    }
    return adminMongoRepository.deleteOneUserAllTodos(id);
  }
}

export const adminService = new AdminService();
