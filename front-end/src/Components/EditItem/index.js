import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

import "./styles.css";

const EditItem = ({
  show,
  id,
  text,
  admin,
  isCompleted,
  handleClose,
  handleSave,
}) => {
  useEffect(() => {
    setNewText(text);
  }, [text]);

  const [newText, setNewText] = useState("");
  const [todoStatus, setTodoStatus] = useState(isCompleted);
  const { activeLanguage } = useLanguageSwitcher();

  const onChangeStatus = (e) => {
    setTodoStatus(!todoStatus);
  };

  const onChangeText = (e) => {
    setNewText(e.target.value);
  };

  const handleSubmit = () => {
    if (admin) {
      handleSave({ text: newText, isCompleted: todoStatus, id });
    }
    handleSave({ text: newText, id });
  };

  const validate = () => {
    return !newText;
  };

  return (
    <div className="edit-todo-form">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {activeLanguage === "EN" ? "EditTodo" : "Редагувати завдання"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="edit-todo-form__input-wrapper">
            <label className="edit-todo-form__input-label" htmlFor="title">
              {activeLanguage === "EN" ? "Title:" : "Назва:"}
            </label>
            <input
              placeholder="Enter todo"
              className="edit-todo-form__input"
              id="text"
              type="text"
              defaultValue={newText}
              onChange={onChangeText}
            />
          </div>
          {admin && (
            <Form.Group className="mb-3">
              <Form.Label className="mb-3">
                {activeLanguage === "EN"
                  ? "Change the todo's status here"
                  : "Змінити статус завдання"}
              </Form.Label>
              <Form.Check
                type="checkbox"
                label="isCompleted"
                checked={todoStatus}
                style={{ fontWeight: "500" }}
                name="isCompleted"
                onChange={(e) => onChangeStatus(e)}
              ></Form.Check>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="edit-todo-form__btns-wrapper">
            <button
              onClick={handleClose}
              className="edit-todo-form__submit-btn"
            >
              {activeLanguage === "EN" ? "Cancel" : "Відмінити"}
            </button>
            <button
              disabled={validate()}
              onClick={handleSubmit}
              className="edit-todo-form__submit-btn"
            >
              {activeLanguage === "EN" ? "Save" : "Зберегти"}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditItem;
