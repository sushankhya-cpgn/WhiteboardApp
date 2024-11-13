import axios from "axios";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";

function useFetch() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function fetchData() {
      console.log(token);
      try {
        const URL = "http://127.0.0.1:4000/api/v1/users/token";
        const response = await axios.get(URL, {
          headers: {
            Auth: token,
          },
        });
        setResponse(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    token && fetchData();
    setLoading(false);
  }, []);
  return { response, loading };
}

export default useFetch;
