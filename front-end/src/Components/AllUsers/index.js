import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import useApiAdmin from "../../hooks/useApiAdmin";
import OneUser from "../OneUser";
import Pages from "../Pagination";
import "./styles.css";
import NewUser from "../NewUser";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const AllUsers = () => {
  const [users, setUsers] = useState({
    data: [],
    total: undefined,
    limit: undefined,
    page: undefined,
  });
  const [show, setShow] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");

  const apiAdmin = useApiAdmin();
  const { activeLanguage } = useLanguageSwitcher();

  const LIMIT = process.env.REACT_APP_LIMIT_USERS;

  useEffect(() => {
    getAllUsers();
  }, [searchEmail]);

  const getAllUsers = async (page = 1) => {
    const users = await apiAdmin.getAllUsers({
      limit: LIMIT,
      page: page - 1,
      email: searchEmail.length > 1 ? searchEmail : "",
    });
    setUsers(users);
  };

  const handleClose = () => setShow(false);

  const onChangePage = (page) => {
    if (page === users.page) return;

    getAllUsers(page);
  };

  const getPagesCount = () => {
    return Math.ceil(users.total / users.limit);
  };

  const updateField = (e) => {
    setSearchEmail(e.target.value);
  };

  return (
    <Container>
      {activeLanguage === "EN" ? (
        <h2 className="m-5">All Users</h2>
      ) : (
        <h2 className="m-5">Усі користувачі</h2>
      )}
      <div className="all_users_container_wrapper">
        <Form.Group>
          <Form.Control
            className="all_users_input_wrapper "
            type="email"
            name="email"
            placeholder={
              activeLanguage === "EN"
                ? "Enter an email to find the user"
                : "Введіть електронну пошту для пошуку користувача"
            }
            value={searchEmail}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Button
          variant="success"
          onClick={() => setShow(true)}
        >
          {activeLanguage === "EN" ? "Create new user" : "Додати користувача"}
        </Button>
      </div>
      <div className="all_users_cards_wrapper">
        {users.data.map((user) => {
          return (
            <OneUser
              key={user.id}
              userData={user}
              deleteUser={apiAdmin.deleteUser}
              deleteAllUserTodos={apiAdmin.deleteAllUsersTodos}
              updateUser={apiAdmin.updateUser}
              refetchUsers={getAllUsers}
            />
          );
        })}
      </div>
      <NewUser
        show={show}
        refetchUsers={getAllUsers}
        handleClose={handleClose}
      />
      <Pages
        onChange={onChangePage}
        active={users.page}
        pages={getPagesCount()}
        maxButtons={3}
      />
    </Container>
  );
};

export default AllUsers;
