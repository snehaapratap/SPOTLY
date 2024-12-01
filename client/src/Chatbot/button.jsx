/* eslint-disable react/prop-types */
// src/app/components/ui/button.js

export const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      {children}
    </button>
  );
};
