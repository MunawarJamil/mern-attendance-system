import { useState } from "react";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";

function Lgin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      console.log("User logged in:", response.data);

      // Save the JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Set success message
      setSuccessMessage("Login successful!");

      // Clear error message if successful
      setError(null);

      // After a delay, navigate to the dashboard page
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred");
      setSuccessMessage(null); // Clear success message if there's an error
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit">Login</button>
      </form>
      <div className="small-text">
        Don't have an account? <a href="/register">Register here</a>
      </div>
    </div>
  );
}

export default Lgin;
