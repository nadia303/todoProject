import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { TrashFill } from "react-bootstrap-icons";
import { PencilFill } from "react-bootstrap-icons";

import EditItem from "../EditItem";
import useApi from "../../hooks/useApi";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const OneTodo = ({ todoData, deleteTodo, refetchTodos }) => {
  const [show, setShow] = useState(false);
  const api = useApi();
  const handleClose = () => setShow(false);
  //gets the active language
  const { activeLanguage } = useLanguageSwitcher();

  //deletes todo
  const handleDeleteTodo = async () => {
    await deleteTodo(todoData.id);
    refetchTodos();
  };

  //opens the new modal window in order to update todo
  const handleUpdateTodo = () => {
    setShow(true);
  };

  //adds new todo to the database
  const handleSave = async ({ id, text, isCompleted }) => {
    try {
      await api.updateTodo(id, { text, isCompleted });
      refetchTodos();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card
        className="shadow-lg m-2"
        style={{
          width: "18rem",
          position: "relative",
        }}
      >
        <Card.Body>
          <Card.Title style={{ color: "rgba(77, 5, 232)" }}>
            {todoData.text}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {activeLanguage === "EN" ? "Todo's status: " : "Статус завдання: "}
            <span style={{ color: "rgba(50, 50, 120)" }}>
              {todoData.isCompleted ? "done" : "todo"}
            </span>
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            {activeLanguage === "EN" ? "Todo's owner: " : "Власник: "}
            <span style={{ color: "rgba(50, 50, 120)" }}>
              {todoData.owner.firstName} {todoData.owner.lastName}
            </span>
          </Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">
            {activeLanguage === "EN" ? "Shared with: " : "Поділено з: "}
            {todoData.sharedWith.map((user) => {
              return (
                <span
                  style={{ color: "rgba(50, 50, 120)", marginRight: "10px" }}
                  key={user.id}
                >
                  {user.firstName} {user.lastName}
                </span>
              );
            })}
          </Card.Subtitle>
          <div style={{}}>
            <TrashFill
              style={{ marginRight: "10px", color: "red", cursor: "pointer" }}
              onClick={handleDeleteTodo}
            />
            <PencilFill
              style={{ color: "green", cursor: "pointer" }}
              onClick={handleUpdateTodo}
            />
          </div>
        </Card.Body>
      </Card>
      <EditItem
        show={show}
        id={todoData.id}
        text={todoData.text}
        isCompleted={todoData.isCompleted}
        admin={true}
        handleClose={handleClose}
        handleSave={handleSave}
      />
    </>
  );
};

export default OneTodo;
