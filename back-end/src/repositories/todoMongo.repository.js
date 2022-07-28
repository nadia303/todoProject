import { Todos } from "../models/todoMogo.model.js";
import { HTTPError } from "../utils/HttpError.js";
import { logger } from "../utils/logger.js";

class TodoMongoRepository {
  async getOwnOrSharedTodoById(id, user) {
    const todo = await Todos.findOne({
      $and: [
        { _id: id },
        { $or: [{ owner: user._id }, { sharedWith: user._id }] },
      ],
    })
      .populate({ path: "owner" })
      .populate({ path: "sharedWith" });
    if (!todo) {
      throw new HTTPError("NotFound", 404);
    }
    return todo;
  }

  async getTodoById() {
    return Todos.findOne({ _id: id });
  }

  async getOwnTodoById(id, user) {
    let todo = "";
    //condition for admin
    if (user.role === "admin") {
      todo = await Todos.findOne({ _id: id });
    } else {
      todo = await Todos.findOne({
        $and: [{ _id: id }, { owner: user._id }],
      });
    }
    if (!todo) {
      throw new HTTPError("NotFound", 404);
    }
    return todo;
  }

  //get all todos for certain user according to query
  async getAll({ limit, page, text }, userId) {
    if (text) {
      const searchText = new RegExp(`.*${text}.*`);
      const todos = await Todos.find({
        $and: [
          { text: { $regex: searchText, $options: "i" } },
          { $or: [{ owner: userId }, { sharedWith: userId }] },
        ],
      })
        .skip(limit * page)
        .limit(limit)
        .populate({ path: "owner" })
        .populate({ path: "sharedWith" });
      return todos;
    }
    const todos = await Todos.find({
      $or: [{ owner: userId }, { sharedWith: userId }],
    })
      .skip(limit * page)
      .limit(limit)
      .populate({ path: "owner" })
      .populate({ path: "sharedWith" });
    return todos;
  }

  //get all existing todos according to query
  async getAllAdmin({ limit, page, text }) {
    if (text) {
      const searchText = new RegExp(`.*${text}.*`);
      const todos = await Todos.find({
        text: { $regex: searchText, $options: "i" },
      })
        .skip(limit * page)
        .limit(limit)
        .populate({ path: "owner" })
        .populate({ path: "sharedWith" });

      return todos;
    }
    const todos = await Todos.find()
      .skip(limit * page)
      .limit(limit)
      .populate({ path: "owner" })
      .populate({ path: "sharedWith" });
    return todos;
  }

  async searchByText(text) {
    const searchText = new RegExp(`.*${text}.*`);

    return Todos.find({ text: { $regex: searchText, $options: "i" } });
  }

  //counts all todos of certain user according to query
  async getCount(id, text) {
    if (text) {
      const searchText = new RegExp(`.*${text}.*`);
      return Todos.countDocuments({
        $and: [
          { text: { $regex: searchText, $options: "i" } },
          { $or: [{ owner: id }, { sharedWith: id }] },
        ],
      });
    }
    return Todos.countDocuments({
      $or: [{ owner: id }, { sharedWith: id }],
    });
  }

  //counts all todos of all users according to query
  async getCountAdmin(text) {
    const searchText = new RegExp(`.*${text}.*`);
    if (text) {
      return Todos.countDocuments({
        text: { $regex: searchText, $options: "i" },
      });
    }
    return Todos.countDocuments();
  }

  async create(object) {
    logger.info(`TodoRepository. Create todo request`, object);
    const todo = new Todos(object);
    await todo.save();

    return todo.getPublickTodo();
  }

  async deleteOne(id) {
    return Todos.deleteOne({ _id: id });
  }

  async update(id, todo) {
    logger.info(`TodoRepository. Update todo request id=${id}`, { todo });
    return Todos.findByIdAndUpdate(id, todo, { new: true })
      .populate({ path: "owner" })
      .populate({ path: "sharedWith" });
  }

  async shareTodo(id, userId) {
    logger.info(`TodoRepository. ShareTodo request id=${id} userId=${userId}`);
    const todo = await Todos.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { sharedWith: userId } },
      { new: true }
    );
    return todo;
  }

  async deleteUserFromSharedTodo(id, userId) {
    logger.info(
      `TodoRepository. ShareTodoDelete request id=${id} userId=${userId}`
    );
    const todo = await Todos.findByIdAndUpdate(
      { _id: id },
      { $pull: { sharedWith: userId } },
      { new: true }
    );
    return todo;
  }

  async getByIdTodoOwner(id, user) {
    const todo = await Todos.findOne({
      $and: [{ _id: id }, { owner: user._id }],
    });
    if (!todo) {
      throw new HTTPError("NotFound", 404);
    }
    return todo;
  }
}

export const todoMongoRepository = new TodoMongoRepository();
