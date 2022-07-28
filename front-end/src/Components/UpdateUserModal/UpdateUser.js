import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const UpdateUser = ({
  userData,
  show,
  updateUser,
  refetchUsers,
  handleClose,
}) => {
  const [data, updateData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: "",
    confirmPassword: "",
    dateOfBirth: userData.dateOfBirth,
    role: userData.role,
  });
  //gets the active language
  const { activeLanguage } = useLanguageSwitcher();

  //updates the field in modal form
  const updateField = (e) => {
    updateData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //updates the user's data
  const updateUserData = async () => {
    //if password was not entered
    if (!data.password) {
      const { password, confirmPassword, ...allData } = data;
      try {
        await updateUser(userData.id, allData);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await updateUser(userData.id, data);
      } catch (err) {
        console.log(err);
      }
    }
    refetchUsers();
    handleCloseModale();
  };

  const validateForm = () => {
    const { password, confirmPassword, ...otherData } = data;
    if (password) {
      return (
        Object.values(data).some((item) => !item) ||
        data.password !== data.confirmPassword
      );
    }
    if (!password && !confirmPassword) {
      return Object.values(otherData).some((item) => !item);
    }
    return true;
  };

  const handleCloseModale = () => {
    updateData({ ...data, password: "", confirmPassword: "" });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModale}>
      <Modal.Header closeButton>
        <Modal.Title>
          {activeLanguage === "EN"
            ? "User information"
            : "Інформація про користувача"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeLanguage === "EN"
              ? "Change user's first name here"
              : "Змінити ім'я"}
          </Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {" "}
            {activeLanguage === "EN"
              ? "Change user's last name here"
              : "Змінити прізвище"}
          </Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeLanguage === "EN"
              ? "Change user's email here"
              : "Змінити поштову скриньку"}
          </Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="email"
            value={data.email}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeLanguage === "EN"
              ? "Change user's password here"
              : "Змінити пароль"}
          </Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="password"
            value={data.password}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeLanguage === "EN"
              ? "Confirm user's password here"
              : "Підтвердити пароль"}
          </Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            {activeLanguage === "EN"
              ? "Change users birth date here"
              : "Змінити дату народження"}
          </Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-3">
            {activeLanguage === "EN"
              ? "Change user's role here"
              : "Змінити роль користувача"}
          </Form.Label>
          <Form.Check
            type="checkbox"
            label="isAdmin"
            checked={data.role === "admin"}
            value={data.role}
            style={{ fontWeight: "500" }}
            name="role"
            onChange={(e) =>
              updateData({ ...data, role: e.target.checked ? "admin" : "user" })
            }
          ></Form.Check>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModale}>
          {activeLanguage === "EN" ? "Close" : "Закрити"}
        </Button>
        <Button
          variant="primary"
          onClick={updateUserData}
          disabled={validateForm()}
        >
          {activeLanguage === "EN" ? "Save changes" : "Зберегти зміни"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateUser;
