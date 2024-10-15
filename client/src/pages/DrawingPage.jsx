import { useState } from "react";
import { FaPen, FaEraser, FaShapes, FaUndo, FaRedo } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { Canvas } from "../components/Canvas";
import { SidebarOptions } from "../components/SidebarOptions";
import { Navbar } from "../components/Navbar";
import MessageBox from "../components/MessageBox";

function DrawingPage() {
  const [active, setActive] = useState(0); // Default to "Pen" tool
  const [color, setColor] = useState("#000000");
  const [undo, setUndo] = useState(false);

  const sidebarOptions = [
    { icon: <FaPen />, label: "Pen", toolId: 0 },
    { icon: <FaEraser />, label: "Eraser", toolId: 1 },
    { icon: <FaShapes />, label: "Shapes", toolId: 2 },
    { icon: <IoIosColorPalette />, label: "Color", toolId: 3 },
    { icon: <FaUndo />, label: "Undo", toolId: 4 },
    { icon: <FaRedo />, label: "Redo", toolId: 5 },
  ];
  function handleClick(el) {
    setActive(el);
    el === 4 ? setUndo(true) : setUndo(false);
  }

  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex h-full">
        {/* Sidebar */}
        <aside className="bg-white w-1/6 flex flex-col space-y-6 items-center py-8 shadow-lg">
          {sidebarOptions.map((option) => (
            <SidebarOptions
              icon={option.icon}
              label={option.label}
              isactive={active === option.toolId}
              handleClick={() => handleClick(option.toolId)}
              color={color}
              setColor={setColor}
              key={option.toolId}
            />
          ))}
        </aside>

        {/* Drawing Canvas */}
        <section className="flex-1 bg-gray-50 ">
          <Canvas activeTool={active} undo={undo}>
            {color}
          </Canvas>
          <MessageBox />
        </section>
      </main>
    </div>
  );
}

export default DrawingPage;
