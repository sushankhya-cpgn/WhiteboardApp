import { useContext, useEffect, useState } from "react";
import Login from "../components/Login";
import { useNavigate } from "react-router";
import FormLayout from "../components/FormLayout";
import Button from "../components/Button";
import UserContext from "../context/userContext";
import useFetch from "../utils/useFetch";
import axios from "axios";

function LandingPage() {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const { user, login } = useContext(UserContext);
  const { response, loading } = useFetch();
  const [joinroom, setJoinroom] = useState();

  useEffect(() => {
    if (response) {
      console.log(response);
      login(response.data.data);
    } else {
      console.log("No response");
    }
  }, [response, login]);

  if (loading) {
    return <p className="text-center">Loading....</p>;
  }

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  async function createMeeting() {
    if (user) {
      const url = "http://127.0.0.1:4000/api/v1/room/createroom";
      const uuid = uuidv4();
      const response = await axios.post(url, {
        roomid: uuid,
      });
      alert(uuid);
      if (response) {
        navigate("/meeting");
      }
    } else {
      setToggle(true);
    }
  }

  async function checkroomid(e) {
    const url = "http://127.0.0.1:4000/api/v1/room/joinroom";
    const response = await axios.post(url, {
      roomId: e.target.value,
    });
    if (response) {
      console.log(response.data.status);
      navigate("/receivestream");
    }
  }

  async function joinMeeting() {
    if (user) {
      setJoinroom(true);
    } else {
      setToggle(true);
    }
  }
  function close_modals() {
    setToggle(false);
    setJoinroom(false);
  }
  function logout() {
    localStorage.removeItem("token");
    window.location.replace("/");
  }
  return (
    <>
      <div
        className={`min-h-screen bg-gray-100 ${
          toggle || joinroom ? "opacity-30" : ""
        }`}
        onClick={toggle || joinroom ? close_modals : undefined}
      >
        {/* Navbar */}
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Whiteboard Co.</h1>
            {!user ? (
              <Button onClick={() => setToggle(true)}>Login</Button>
            ) : (
              <div className="flex flex-row gap-4">
                <p>Hello {user.name}</p>
                <Button onClick={logout}>Logout</Button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">Welcome to Miro!</h2>
              <p className="text-gray-600 mb-8">
                Unleash your creativity with collaborative whiteboards.
              </p>
              <div className="space-x-4">
                <Button onClick={createMeeting}>Create Meeting</Button>
                <Button onClick={joinMeeting}>Join a meeting</Button>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                src="path_to_your_image.jpg"
                alt="Office Interior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Room Showcase */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">
              Room Showcase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <img
                  src="path_to_brainstorming_image.jpg"
                  alt="Brainstorming"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-xl font-bold mb-2">Brainstorming</h4>
                <p className="text-gray-600">
                  A space to generate ideas collaboratively.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <img
                  src="path_to_marketing_plan_image.jpg"
                  alt="Marketing Plan"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-xl font-bold mb-2">Marketing Plan</h4>
                <p className="text-gray-600">
                  Outline and strategize marketing campaigns.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <img
                  src="path_to_design_team_image.jpg"
                  alt="Design Team"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-xl font-bold mb-2">Design Team</h4>
                <p className="text-gray-600">
                  Collaborate on design projects and drafts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {toggle && (
        <FormLayout>
          <Login settogglelogin={setToggle} />
        </FormLayout>
      )}
      {joinroom && (
        <FormLayout>
          <h1 className=" text-center">Join room</h1>
          <input
            type="text"
            className=" m-4 border-black bg-slate-50"
            placeholder="Enter room code"
          ></input>
          <Button onClick={checkroomid}>Submit</Button>
        </FormLayout>
      )}
    </>
  );
}

export default LandingPage;
