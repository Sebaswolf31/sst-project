import React from "react";
import Login from "./login";

const LoginView = () => {
  return (
    <div>
      <div
        className="flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url("/login.jpg")`,
        }}
      >
        <Login />
      </div>
      ;{" "}
    </div>
  );
};

export default LoginView;
