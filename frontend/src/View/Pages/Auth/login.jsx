import "../../../CSS/Auth/login.css";
import brightBackGround from "../../../Assets/Images/Logo/PNG/brightFormBackGround.png";
import studentBackGround from "../../../Assets/Images/Logo/PNG/StudentBackGround.png";
import Logo from "../../../Assets/Images/Logo/PNG/LogoSquare@0.5x.png";
import Input from "../../Components/Auth/Input.js";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "../../../index.css";
import axios from "axios";
import { LOGIN } from "../../../Api/Api.js";
import { AuthContext } from "../../../Context/AuthContext.jsx";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChanges(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Send login request (cookies will be handled automatically)
      await axios.post(LOGIN, formData, { withCredentials: true });

      // ✅ Fetch user data after login
      const response = await axios.get("http://localhost:8080/api/auth/user", {
        withCredentials: true,
      });
      console.log("User data:", response);
      // ✅ Update authentication context
      loginUser(response.data);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <div className="login-body">
      <div className="container">
        <div className="form-container">
          <div className="login-form form-splitter">
            <form className="form-group" onSubmit={handleLogin}>
              <img className="logo" src={Logo} alt="logo" />
              
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                label="Email"
                value={formData.email}
                icon={faUser}
                onChange={handleChanges}
              />

              <Input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                label="password"
                value={formData.password}
                icon={faLock}
                onChange={handleChanges}
              />

              <button type="submit" className="btn">
                {loading ? "Logging in..." : "Submit"}
              </button>
            </form>

            <div className="form-images">
              <img className="bright-background" src={brightBackGround} alt="login" />
              <h3>Empowering learners<br/>of today to become <br/>the leaders of <br/>tomorrow</h3>
              <img className="student-background" src={studentBackGround} alt="login" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
