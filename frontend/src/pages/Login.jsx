import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen bg-white-100% flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        
       
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-300 rounded-full w-14 h-14 flex items-center justify-center">
            <span className="text-black text-2xl font-bold">W</span>
          </div>
        </div>

      
        <h2 className="text-2xl font-bold text-center mb-6">Welcome back!</h2>

      
        <form className="space-y-5">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 rounded-full bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-full bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-yellow-400" />
              <span>Remember</span>
            </label>
            <a href="#" className="text-yellow-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300 text-black font-semibold py-3 rounded-full hover:bg-yellow-400 transition"
          >
            Sign in
          </button>
        </form>

        
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-4 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <div className="space-y-3">
          <button className="flex items-center justify-center w-full border border-gray-600 py-2 rounded-full hover:bg-gray-700 transition">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="w-5 h-5 mr-2"
            />
            Sign in with Apple
          </button>
          <button className="flex items-center justify-center w-full border border-gray-600 py-2 rounded-full hover:bg-gray-700 transition">
            <img
              src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
        </div>

        
        <p className="text-center text-sm text-gray-400 mt-6">
          Not a member yet?{" "}
          <a href="#" className="text-yellow-400 hover:underline">
            Try 7-days FREE trial
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;
