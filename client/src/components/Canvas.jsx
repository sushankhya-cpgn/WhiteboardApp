import { useRef, useState, useEffect, useContext } from "react";
import UserContext from "../context/userContext";
import { useNavigate } from "react-router";
import useFetch from "../utils/useFetch";

export function Canvas({ activeTool, children }) {
  const canvasRef = useRef(null);
  let contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // const [drawingArray, setDrawingArray] = useState([contextRef.current]);
  const points = useRef([]);
  const path = useRef([]);
  const { user, login } = useContext(UserContext);
  const { response, loading } = useFetch();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        if (response) {
          const user = response.data.data;
          console.log(user);
          login(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchData();
  }, [response, login]);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    contextRef.current = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth * 0.98; // 98% of window width
      canvas.height = window.innerHeight * 0.98; // 98% of window height
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function startDrawing(e) {
    setIsDrawing(true);
    contextRef.current.beginPath();
    draw(e, children);
  }

  function finishDrawing() {
    setIsDrawing(false);
    if (points.current.length > 0) {
      path.current.push([...points.current]);
    }

    points.current = [];
    contextRef.current.beginPath();
  }

  function undoChanges() {
    path.current.splice(-1, 1);
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    path.current.forEach((points) => {
      contextRef.current.beginPath();
      points.forEach((xandypoint, i) => {
        if (i === 0) {
          contextRef.current.moveTo(xandypoint.x, xandypoint.y);
        } else {
          contextRef.current.lineTo(xandypoint.x, xandypoint.y);
        }
        contextRef.current.stroke();
      });
    });
  }
  function draw(e, children) {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      points.current.push({ x, y });

      if (activeTool === 0 || activeTool === 1) {
        contextRef.current.lineWidth = 10;
        activeTool === 1
          ? (contextRef.current.strokeStyle = "#F9FAFB")
          : (contextRef.current.strokeStyle = children);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        console.log(contextRef.current);
        contextRef.current.lineCap = "round";
      }
      if (activeTool === 2) {
        console.log("Shapes");
      }
      if (activeTool === 4) {
        undoChanges();
      }
    }
  }
  return (
    <canvas
      ref={canvasRef}
      className={`border-2 h-[98%] w-[98%] mt-0 ${
        activeTool === 0 &&
        "cursor-[url(../public/pencil-cursor-svgrepo-com),_pointer]"
      }`}
      onMouseDown={startDrawing}
      onMouseMove={(e) => draw(e, children)}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
    ></canvas>
  );
}
