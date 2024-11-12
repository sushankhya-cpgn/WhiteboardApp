import axios from "axios";
import { useEffect, useState } from "react";

function useFetch() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
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
    fetchData();
  }, []);
  return { response, loading };
}

export default useFetch;
