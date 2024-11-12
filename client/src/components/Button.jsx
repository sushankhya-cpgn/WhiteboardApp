import { useState } from "react";

function Button({ children, onClick }) {
  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
