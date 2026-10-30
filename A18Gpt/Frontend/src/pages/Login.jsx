import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      state,
      name,
      email,
      password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        <span className="text-purple-700">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>

      {state === "register" && (
        <div className="w-full">
          <p>Name</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
            required
          />
        </div>
      )}

      <div className="w-full">
        <p>Email</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
          required
        />
      </div>

      <div className="w-full">
        <p>Password</p>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-700"
          required
        />
      </div>

      {state === "register" ? (
        <p className="text-sm">
          Already have an account?{" "}
          <span
            onClick={() => setState("login")}
            className="text-purple-700 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      ) : (
        <p className="text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => setState("register")}
            className="text-purple-700 cursor-pointer font-medium"
          >
            Register
          </span>
        </p>
      )}

      <button
        type="submit"
        className="bg-purple-700 hover:bg-purple-800 transition text-white w-full py-2 rounded-md cursor-pointer"
      >
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default Login;