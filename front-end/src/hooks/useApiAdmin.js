import axios from "axios";

import { useAuth } from "./useAuth";

export default function useApiAdmin() {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/v1`;
  const auth = useAuth();

  const axiosRequest = async (method, uri, data, headers) => {
    const token = auth.accessToken;
    try {
      const params = method === "GET" ? data : null;
      const body = method !== "GET" ? data : null;
      return await axios(`${apiUrl}/${uri}`, {
        method,
        params,
        data: body,
        headers: { ...headers, Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      if (e?.response?.status === 401 && token) {
        auth.singOut(); // If token expired
      }
      throw e;
    }
  };

  return {
    getAllUsers: (data) =>
      axiosRequest("GET", "/admin/users", data).then(({ data }) => data),
    deleteUser: (id) =>
      axiosRequest("DELETE", `/admin/users/${id}`).then(({ data }) => data),
    deleteAllUsersTodos: (userId) =>
      axiosRequest("DELETE", `/admin/users/todos/${userId}`).then(
        ({ data }) => data
      ),
    updateUser: (id, data) =>
      axiosRequest("PUT", `/admin/users/${id}`, data).then(({ data }) => data),
    getUserTodos: (data) =>
      axiosRequest("GET", "/admin/users/todos", data).then(({ data }) => data),
    getAllTodos: (data) =>
      axiosRequest("GET", "/admin/todos", data).then(({ data }) => data),
    getUserById: (id) =>
      axiosRequest("GET", `admin/users/${id}`).then(({ data }) => data),
    register: (data) => axiosRequest("POST", "admin/users", data),
  };
}
