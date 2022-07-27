import { HTTPError } from "../utils/HttpError.js";
import { logger } from "../utils/logger.js";
import { authService } from "../services/auth.service.js";
import { todoService } from "../services/todo.service.js";

export function ownerMiddleware(req, res, next) {
  logger.info("Owner request", req.params.id, req.user);

  todoService
    .getTodoAndValidateOwner(req.params.id, req.user)
    .then((todo) => {
      logger.info("Owner request passed", { todo: todo });
      next();
    })
    .catch((e) => {
      logger.error("Authentication error on authService.getUser", {
        message: e.message,
      });
      const error = new HTTPError("Unauthorized", 401);
      next(error);
    });
}
