import { useState } from "react";

function FormLayout({ children }) {
  return (
    <div className="flex  justify-center w-96 h-96 bg-gray-100 ">
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 flex flex-row justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default FormLayout;
