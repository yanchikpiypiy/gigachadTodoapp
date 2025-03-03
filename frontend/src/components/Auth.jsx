import { useState, useEffect } from "react";

function Auth({ onAuthSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputClass =
    "w-full h-10 px-4 border-2 border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:border-blue-400";

  // On mount, check if a token exists in localStorage.
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      onAuthSuccess(storedToken);
    }
  }, [onAuthSuccess]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      // Save token to localStorage
      localStorage.setItem("jwtToken", data.access_token);
      onAuthSuccess(data.access_token);
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }
  async function handleLoginAfterRegister(){
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      // Save token to localStorage
      localStorage.setItem("jwtToken", data.access_token);
      onAuthSuccess(data.access_token);
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    const payload = { username, password, email };

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Registration failed");
      const data = await response.json();
      handleLoginAfterRegister()
      // Save token to localStorage if returned from registration
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">
        {isRegistering ? "Register" : "Login"}
      </h1>
      <form
        onSubmit={isRegistering ? handleRegister : handleLogin}
        className="flex flex-col space-y-4 w-80"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
          required
          autoComplete="username"
        />
        {isRegistering && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
            autoComplete="email"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
          autoComplete={isRegistering ? "new-password" : "current-password"}
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            required
            autoComplete="new-password"
          />
        )}
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 h-10 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError("");
          }}
          className="text-blue-400 hover:underline"
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
