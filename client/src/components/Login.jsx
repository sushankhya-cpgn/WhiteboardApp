import { useContext, useState } from "react";
import UserContext from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router";

function Login({ settogglelogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erromsg, setErrormsg] = useState("");
  const { login } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:4000/api/v1/users/login",

        {
          email: username,
          password: password,
        }
        // { withCredentials: true }
      );
      localStorage.setItem("token", response.data.data.token);
      const user = response.data.data;
      console.log(user);
      login(user);
      settogglelogin(false);
      console.log(response);
    } catch (error) {
      setErrormsg(error.response.data.message);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Login
      </h2>
      {erromsg && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-red-600 rounded-lg bg-blue-300 "
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>

          <div>
            <span className="font-medium">{erromsg}</span>
          </div>
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </>
  );
}

export default Login;
