import { Outlet, NavLink } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Container from "react-bootstrap/Container";

import { useAuth } from "../../hooks/useAuth";
import useUserData from "../../hooks/useUserData";
import useLanguageSwitcher from "../../hooks/useLanguageSwitcher";

const Layout = () => {
  const auth = useAuth();
  const user = useUserData();
  const lang = useLanguageSwitcher();

  const handleLogout = () => {
    auth.singOut();
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 80px 0 10px",
        }}
      >
        <nav style={{ display: "flex", alignItems: "center" }}>
          <button style={{ height: "60px", width: "100px" }}>
            <NavLink to="list">
              {lang.activeLanguage === "EN" ? "List" : "Список завдань"}
            </NavLink>
          </button>
          <button style={{ height: "60px", width: "100px" }}>
            <NavLink to="profile">
              {lang.activeLanguage === "EN" ? "Profile" : "Профіль"}
            </NavLink>
          </button>
          {user?.role === "admin" && (
            <button style={{ height: "60px", width: "100px" }}>
              <NavLink to="admin/users">
                {lang.activeLanguage === "EN" ? "All users" : "Усі користувачі"}
              </NavLink>
            </button>
          )}
          {user?.role === "admin" && (
            <button style={{ height: "60px", width: "100px" }}>
              <NavLink to="admin/todos">
                {lang.activeLanguage === "EN" ? "All todos" : "Усі завдання"}
              </NavLink>
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{ height: "60px", width: "100px" }}
          >
            {lang.activeLanguage === "EN" ? "LogOut" : "Вийти"}
          </button>
        </nav>
        <DropdownButton
          variant="warning"
          title={lang.activeLanguage}
          align="end"
          id="input-group-dropdown-1"
        >
          {Object.values(lang.languages).map((el) => {
            return (
              <Dropdown.Item key={el} onClick={() => lang.changeLanguage(el)}>
                {el}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <Outlet />
    </Container>
  );
};

export default Layout;
