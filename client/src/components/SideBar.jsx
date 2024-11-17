import { FaEraser, FaPen, FaRedo, FaShapes, FaUndo } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { SidebarOptions } from "./SidebarOptions";
import { useState } from "react";

function SideBar({ active, setActive, color, setUndo, setColor }) {
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
  );
}

export default SideBar;
