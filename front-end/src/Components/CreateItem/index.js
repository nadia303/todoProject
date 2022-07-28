import { useState } from "react";

import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";
import "./styles.css";

const CreateItem = ({ handleCreate }) => {
  const [text, setText] = useState("");
  const { activeLanguage } = useLanguageSwitcher();

  const onChangeText = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleCreate(text);
    setText("");
  };

  return (
    <div className="create-todo-form">
      <div className="create-todo-form__title">
        {activeLanguage === "EN" ? "CreateTodo" : "Створити нове завдання"}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="create-todo-form__input-wrapper">
          <label className="create-todo-form__input-label" htmlFor="text">
            {activeLanguage === "EN" ? "Title: " : "Назва: "}
          </label>
          <input
            placeholder={
              activeLanguage === "EN" ? "Enter todo" : "Введіть завдання"
            }
            className="create-todo-form__input"
            id="text"
            type="text"
            value={text}
            onChange={onChangeText}
          />
        </div>
        <button
          disabled={!text.length}
          className="create-todo-form__submit-btn"
          type="submit"
        >
          {activeLanguage === "EN" ? "Submit" : "Зберегти"}
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
