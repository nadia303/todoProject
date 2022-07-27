import { adminService } from "../services/admin.service.js";
import { HTTPError } from "../utils/HttpError.js";
import { logger } from "../utils/logger.js";

class AdminController {
  constructor(service, logger) {
    this.service = service;
    this.log = logger;
  }

  async getAllUsers(req, res) {
    this.log.info("Got getAllUsers request");
    let { page, limit, email } = req.query;
    if (page) {
      page = parseInt(page);
    }
    if (limit) {
      limit = parseInt(limit);
    }
    const users = await this.service.getAllUsers({ page, limit, email });
    res.json(users);
  }

  async deleteOneUser(req, res) {
    const id = req.params.id;
    this.log.info("Got deleteOneUser request", { id: `${id}` });
    await this.service.deleteOneUser(id);
    res.json({ message: "User has been deleted succesfully" });
  }

  async deleteOneUserAllTodos(req, res) {
    const id = req.params.id;
    this.log.info("Got deleteOneUserAllTodos request", { id: `${id}` });
    await this.service.deleteOneUserAllTodos(id);
    res.json({ message: "User's todos has been deleted succesfully" });
  }

  async getUserById(req, res) {
    const id = req.params.id;
    this.log.info("Got getByIdUser request", { id: `${id}` });
    const user = await this.service.getUserById(id);
    this.log.info("Got response from service", { user });
    res.json(user);
  }

  async getTodosByQuery(req, res) {
    const belong = req.query.belong;
    this.log.info("Got getUserByQuery request", { query: `${belong}` });
    const todos = await this.service.getUserById(belong);
    this.log.info("Got response from service", { todos });
    res.json(todos);
  }

  async getOneUserAllTodosByQuery(req, res) {
    const userId = req.query.userId;
    this.log.info("Got getOneUserAllTodosByQuery request", {
      userId: `${userId}`,
    });
    let { page, limit, text } = req.query;
    if (page) {
      page = parseInt(page);
    }
    if (limit) {
      limit = parseInt(limit);
    }
    const todos = await this.service.getAllTodos({ page, limit, text }, userId);
    res.json(todos);
  }

  // async getOneUserAllTodos(req, res) {
  //   const userId = req.params.id;
  //   this.log.info("Got getAllTodos of one user request", {
  //     userId: `${userId}`,
  //   });
  //   let { page, limit } = req.query;
  //   if (page) {
  //     page = parseInt(page);
  //   }
  //   if (limit) {
  //     limit = parseInt(limit);
  //   }
  //   const todos = await this.service.getAllTodos({ page, limit }, userId);
  //   res.json(todos);
  // }

  async updateUserData(req, res) {
    const id = req.params.id;
    const userData = req.body;
    this.log.info("Got update request for user", { id, userData });
    const updatedUser = await this.service.updateUserData({
      id,
      userData,
    });
    this.log.info("Got updated user", { id, updatedUser });
    res.json(updatedUser);
  }
}

export const adminController = new AdminController(adminService, logger);
