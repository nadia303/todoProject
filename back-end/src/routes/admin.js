import express from "express";

import { adminController } from "../controlers/admin.controller.js";
import { authMiddlevare } from "../middlewares/auth.middleware.js";
import { shouldHaveRole } from "../middlewares/access.middleware.js";
import { ROLES } from "../models/constants.js";
import { register } from "../controlers/auth.controller.js";
import { todoController } from "../controlers/todo.controller.js";

const router = express.Router();

// get all users
router.get(
  "/users",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) => adminController.getAllUsers(req, res).catch(next)
);

// get all todos of all users
router.get(
  "/todos",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) =>
    todoController.getAllTodosAdmin(req, res).catch(next)
);

// add new user
router.post(
  "/users",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) => register(req, res).catch(next)
);

// delete user by id
router.delete(
  "/users/:id",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) => adminController.deleteOneUser(req, res).catch(next)
);

// delete all users todos
router.delete(
  "/users/todos/:id",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) =>
    adminController.deleteOneUserAllTodos(req, res).catch(next)
);

// update user
router.put(
  "/users/:id",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) => adminController.updateUserData(req, res).catch(next)
);

// get all todos of one user by user's id
router.get(
  "/users/todos",
  authMiddlevare,
  shouldHaveRole(ROLES.ADMIN),
  async (req, res, next) =>
    adminController.getOneUserAllTodosByQuery(req, res).catch(next)
);

// get user by id
router.get("/users/:id", async (req, res, next) =>
  adminController.getUserById(req, res).catch(next)
);

export default router;
