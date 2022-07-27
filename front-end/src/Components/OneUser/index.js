import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrashFill } from "react-bootstrap-icons";
import { PencilFill } from "react-bootstrap-icons";

import "./styles.css";
import UpdateUser from "../UpdateUserModal/UpdateUser";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const OneUser = ({
  userData,
  deleteUser,
  deleteAllUserTodos,
  updateUser,
  refetchUsers,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      await Promise.all([
        deleteAllUserTodos(userData.id),
        deleteUser(userData.id),
      ]);
    } catch (err) {
      console.log(err);
    }
    refetchUsers();
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setShow(true);
  };

  return (
    <>
      <Link
        to={`todos?userId=${userData.id}`}
        className="one-user-card_wrapper"
      >
        <div className="one-user-card">
          <h4 className="one-user-card_title">
            {userData.firstName} {userData.lastName}
          </h4>
          <div className="one-user-card_icons_wrapper">
            <TrashFill
              className="one-user-card_icon_delete"
              onClick={(e) => handleDeleteUser(e)}
            />
            <PencilFill
              className="one-user-card_icon_update"
              onClick={(e) => handleUpdateUser(e)}
            />
          </div>
        </div>
      </Link>
      <UpdateUser
        userData={userData}
        show={show}
        updateUser={updateUser}
        refetchUsers={refetchUsers}
        handleClose={handleClose}
      />
    </>
  );
};

export default OneUser;
