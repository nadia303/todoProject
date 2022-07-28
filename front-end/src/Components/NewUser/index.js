import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import useApiAdmin from "../../hooks/useApiAdmin";

const NewUser = ({ show, refetchUsers, handleClose }) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    role: "",
  });

  const api = useApiAdmin();

  //updates each field while new data is entering
  const updateField = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //adds the new user to database
  const addNewUser = async () => {
    try {
      await api.register(data);
    } catch (error) {
      console.error("error", error);
    }
    refetchUsers();
    handleClose();
  };

  const handleCloseModal = () => {
    handleClose();
    setData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      role: "",
    });
  };

  const validateForm = () => {
    const { role, ...otherData } = data;
    return (
      Object.values(otherData).some((item) => !item) ||
      otherData.password !== otherData.confirmPassword
    );
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add new user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label> Enter user's first name here</Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label> Enter user's last name here</Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label> Enter user's email here</Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="email"
            value={data.email}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label> Enter user's password here</Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="password"
            value={data.password}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label> Confirm user's password here</Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label> Enter user's birth date here</Form.Label>
          <Form.Control
            style={{ fontWeight: "500" }}
            type="text"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(event) => updateField(event)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="mb-3"> Change user's role here</Form.Label>
          <Form.Check
            type="checkbox"
            label="isAdmin"
            value={data.role}
            style={{ fontWeight: "500" }}
            name="role"
            onChange={(e) => {
              setData({ ...data, role: e.target.checked ? "admin" : "user" });
            }}
          ></Form.Check>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={addNewUser}
          disabled={validateForm()}
        >
          Save user
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewUser;
