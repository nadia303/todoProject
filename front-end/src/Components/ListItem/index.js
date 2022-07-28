import { useState } from "react";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

import Share from "../Share";
import "./styles.css";

const ListItem = (props) => {
  const {
    text,
    id,
    isCompleted,
    owner,
    handleEdit,
    handleRemove,
    handleCheck,
    refetchTodos,
    sharedWith,
  } = props;

  const [show, setShow] = useState(false);
  const { activeLanguage } = useLanguageSwitcher();

  const handleClose = () => setShow(false);

  //shows the share module window in order to share the todo with another user
  const showShareModule = () => {
    if (!isCompleted) {
      setShow(true);
    }
  };

  return (
    <div className="list-item">
      <div className="list-item_wrapper">
        <p
          className={`list-item__title list-item__title--${
            isCompleted ? "checked" : null
          }`}
          style={{ margin: " 0 0 10px 0" }}
        >
          {text}
        </p>
        <p style={{ margin: "0 0 10px 0" }}>
          {activeLanguage === "EN" ? "Owner: " : "Власник: "}
          <span style={{ color: "#4b86b4", fontWeight: "500" }}>
            {owner.firstName} {owner.lastName}
          </span>
        </p>
        {sharedWith.length > 0 && (
          <div>
            {activeLanguage === "EN" ? "Shared with: " : "Поділено з: "}
            {sharedWith.map((user) => {
              return (
                <span
                  style={{
                    color: "#4b86b4",
                    marginRight: "10px",
                    fontWeight: "500",
                  }}
                  key={user.id}
                >
                  {user.firstName} {user.lastName}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="list-item__btns-wrapper">
        <input
          onClick={() => handleCheck(id)}
          className="list-item__checkbox"
          type="checkbox"
        />
        <i className="fa fa-pencil" onClick={() => handleEdit(id)} />
        <i className="fa fa-trash" onClick={() => handleRemove(id)} />
        <i className="fa fa-plus-circle" onClick={showShareModule}></i>
      </div>
      <Share
        show={show}
        handleClose={handleClose}
        sharedWith={sharedWith}
        todoId={id}
        todoName={text}
        refetchTodos={refetchTodos}
      />
    </div>
  );
};

export default ListItem;
