import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

import useApi from "../../hooks/useApi";
import useUserData from "../../hooks/useUserData";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const Share = ({
  show,
  handleClose,
  sharedWith,
  todoId,
  todoName,
  refetchTodos,
}) => {
  const [email, setEmail] = useState("");
  const [error, showError] = useState(false);

  const api = useApi();
  const user = useUserData();
  //gets the active language
  const { activeLanguage } = useLanguageSwitcher();

  //saves the user email
  const setUserEmail = (email) => {
    showError(false);
    setEmail(email);
  };

  //shares todo with another user
  const shareWithUser = async () => {
    showError(false);
    try {
      await api.shareTodo(todoId, email);
      refetchTodos();
    } catch (e) {
      console.log(e);
      showError(true);
    }
    setEmail("");
  };

  //prevents of adding the same email as owner has or empty field
  const validateInput = () => {
    return user.email === email || !email;
  };

  //deletes the user from shared todo
  const deleteUserFromSHaredTodo = async (userId) => {
    try {
      await api.deleteUserFromSharedTodo(todoId, userId);
      refetchTodos();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#708090" }}>
          {" "}
          {activeLanguage === "EN"
            ? "Share todo with"
            : "Поділити завдання з: "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h4 style={{ color: "#483D8B", marginBottom: "20px" }}>{todoName}</h4>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {sharedWith.map((user) => {
              return (
                <div
                  key={user.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginRight: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <span style={{ color: "#4b86b4" }}>
                    {user.firstName} {user.lastName}
                  </span>
                  <CloseButton
                    style={{ height: "2px", marginTop: "2px" }}
                    onClick={() => deleteUserFromSHaredTodo(user.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeLanguage === "EN"
              ? "Enter an email of the user to share with him your todo"
              : "Введіть поштову скриньку користувача з яким хочете поділитись"}
          </Form.Label>
          {error && (
            <Form.Label style={{ color: "#ee4035" }}>
              {activeLanguage === "EN"
                ? "There is no such user in database"
                : "Такий користувач відсутній в базі"}
            </Form.Label>
          )}
          <Form.Control
            style={{ fontWeight: "500" }}
            type="email"
            name="share"
            value={email}
            onChange={(event) => setUserEmail(event.target.value)}
          />
          <Button
            variant="primary"
            type="email"
            onClick={shareWithUser}
            disabled={validateInput()}
            className="mt-3"
          >
            {activeLanguage === "EN" ? "Share" : "Поділитися"}
          </Button>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {activeLanguage === "EN" ? "Close" : "Закрити"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Share;
