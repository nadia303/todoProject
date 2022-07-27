import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useSearchParams } from "react-router-dom";

import OneTodo from "../OneTodo";
import Pages from "../Pagination";
import useApiAdmin from "../../hooks/useApiAdmin";
import useApi from "../../hooks/useApi";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const AllTodos = ({ select }) => {
  const [todos, setTodos] = useState({
    data: [],
    total: undefined,
    limit: undefined,
    page: undefined,
  });

  const [user, setUser] = useState({
    firstName: undefined,
    lastName: undefined,
  });

  const [todoSearch, setTodoSearch] = useState("");

  const apiAdmin = useApiAdmin();
  const api = useApi();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("userId");
  const { activeLanguage } = useLanguageSwitcher();

  const LIMIT = process.env.REACT_APP_LIMIT_TODOS;

  useEffect(() => {
    select === "all" ? getAllTodos() : getAllUsersTodos();
  }, [todoSearch, select]);

  const getAllUsersTodos = async (page = 1) => {
    const todos = await apiAdmin.getUserTodos({
      userId: id,
      limit: LIMIT,
      page: page - 1,
      text: todoSearch.length > 1 ? todoSearch : "",
    });
    const user = await apiAdmin.getUserById(id);
    setTodos(todos);
    setUser({ firstName: user.firstName, lastName: user.lastName });
  };

  const getAllTodos = async (page = 1) => {
    const todos = await apiAdmin.getAllTodos({
      limit: LIMIT,
      page: page - 1,
      text: todoSearch.length > 1 ? todoSearch : "",
    });
    setTodos(todos);
  };

  const onChangePage = (page) => {
    if (page === todos.page) return;
    select === "all" ? getAllTodos(page) : getAllUsersTodos(page);
  };

  const getPagesCount = () => {
    return Math.ceil(todos.total / todos.limit);
  };

  const setTodoSearchMode = (e) => {
    setTodoSearch(e.target.value);
  };

  return (
    <>
      <Container>
        {select === "userTodos" && (
          <h2 className="m-4">
            {activeLanguage === "EN" ? "All todos of " : "Всі завдання "}
            {user.firstName} {user.lastName}
          </h2>
        )}
        {select === "all" && (
          <h2 className="m-4">
            {activeLanguage === "EN" ? "All todos" : "Усі завдання"}
          </h2>
        )}
        <Form.Group className="mt-5">
          <Form.Control
            style={{ marginLeft: "10px", marginTop: "30px", width: "590px" }}
            className="mb-4"
            type="email"
            name="email"
            placeholder={
              activeLanguage === "EN"
                ? "Enter a todo name here..."
                : "Введіть назву завдання..."
            }
            value={todoSearch}
            onChange={(event) => setTodoSearchMode(event)}
          />
        </Form.Group>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {todos.data.map((todo) => {
            return (
              <OneTodo
                key={todo.id}
                todoData={todo}
                deleteTodo={api.deleteTodo}
                refetchTodos={select === "all" ? getAllTodos : getAllUsersTodos}
              />
            );
          })}
        </div>
        <div style={{ marginTop: "30px", marginLeft: "10px" }}>
          <Pages
            onChange={onChangePage}
            active={todos.page}
            pages={getPagesCount()}
            maxButtons={3}
          />
        </div>
      </Container>
    </>
  );
};

export default AllTodos;
