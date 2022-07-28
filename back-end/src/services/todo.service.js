import { todoMongoRepository } from "../repositories/todoMongo.repository.js";
import { HTTPError } from "../utils/HttpError.js";
import { logger } from "../utils/logger.js";
import { authService } from "./auth.service.js";

class TodoService {
  async createTodo({ text }, user) {
    logger.info(`TodoService. Got create todo request`, { text });
    return todoMongoRepository.create({ text, owner: user._id });
  }

  async getAllTodos({ limit = 10, page = 0, text }, user) {
    page = page > 0 ? page : 0;
    logger.info(`TodoService. Got get ALL todo request`, { limit, page });
    const [todos, total] = await Promise.all([
      todoMongoRepository.getAll({ limit, page, text }, user._id),
      todoMongoRepository.getCount(user._id, text),
    ]);

    return {
      data: todos.map((todo) => todo.getPublickTodoWithUsers()),
      limit,
      page: page + 1,
      total,
    };
  }

  async getAllTodosAdmin({ limit = 10, page = 0, text }) {
    page = page > 0 ? page : 0;
    logger.info(`TodoService. Got get ALL todo admin request`, { limit, page });
    const [todos, total] = await Promise.all([
      todoMongoRepository.getAllAdmin({ limit, page, text }),
      todoMongoRepository.getCountAdmin(text),
    ]);

    return {
      data: todos.map((todo) => todo.getPublickTodoWithUsers()),
      limit,
      page: page + 1,
      total,
    };
  }

  async getById(id, user) {
    logger.info(`TodoService. Get by id request ${id}`);
    const todo = await todoMongoRepository.getOwnOrSharedTodoById(id, user);
    return todo.getPublickTodoWithUsers();
  }

  async searchByText(text) {
    return todoMongoRepository.searchByText(text);
  }
  
  async update({ id, todoData, user }) {
    logger.info(`TodoService. Got update todo request ${id}`);
    const todo = await todoMongoRepository.getOwnTodoById(id, user);
    if (!todo) {
      logger.warn(
        "TodoService. Todo not found or user dont have access to edit it"
      );
      throw new HTTPError("Notfound", 404);
    }
    logger.info(`TodoService. Got todo from DB ${id}`);

    const newTodo = await todoMongoRepository.update(id, todoData);
    logger.info(`TodoService. Todo updated ${id}`);

    return newTodo.getPublickTodoWithUsers();
  }
  async deleteOne(id, user) {
    const todo = await todoMongoRepository.getOwnTodoById(id, user);
    if (!todo) {
      logger.warn(
        "TodoService. Todo not found or user dont have access to edit it"
      );
      throw new HTTPError("Notfound", 404);
    }
    return todoMongoRepository.deleteOne(id);
  }
  async shareTodo(id, email) {
    logger.info(`TodoService. Got shareTodo request`);
    //gets the user by email to get it id
    const user = await authService.getUserByEmail(email);
    return todoMongoRepository.shareTodo(id, user.id);
  }

  async deleteUserFromSharedTodo(id, userId) {
    logger.info(`TodoService. Got delete user from shared todo request`);
    return todoMongoRepository.deleteUserFromSharedTodo(id, userId);
  }

  async getTodoAndValidateOwner(todoId, user) {
    const todo = await todoMongoRepository.getByIdTodoOwner(todoId, user);
    if (!todo) {
      throw new HTTPError("Not found", 404);
    }
    return todo;
  }
}

export const todoService = new TodoService();
