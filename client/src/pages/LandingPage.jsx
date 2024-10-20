import { useState } from "react";
import Login from "../components/Login";

function LandingPage() {
  const [toggleLogin, settogglelogin] = useState(false);
  function handleClick() {
    settogglelogin((l) => !l);
  }
  return (
    <>
      <div
        className={`min-h-screen bg-gray-100 ${
          toggleLogin ? "opacity-30" : ""
        }`}
        onClick={toggleLogin ? () => settogglelogin((l) => !l) : undefined}
      >
        {/* Navbar */}
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Whiteboard Co.</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleClick}
            >
              Login
            </button>
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
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md">
                  Create a room
                </button>
                <button className="bg-gray-600 text-white px-6 py-3 rounded-md">
                  Join a room
                </button>
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
      {toggleLogin && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 flex flex-row justify-center">
          <Login settogglelogin={settogglelogin} />
        </div>
      )}
    </>
  );
}

export default LandingPage;
