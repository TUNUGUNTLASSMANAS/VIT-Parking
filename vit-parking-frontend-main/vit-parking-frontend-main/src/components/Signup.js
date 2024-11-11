import { useEffect, useState } from "react";
import "./bootstrap.css";
import "./login.css";
import "@fontsource/noto-sans";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Temp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Path, setPath] = useState("/");
  const location = useLocation();
  const { returnPath = '/' } = location.state || {};

  useEffect(() => {
    const token = localStorage.getItem("token");
  // console.log("Here login: ",returnPath);
    if (token) navigate(returnPath);
    setPath(returnPath);
  }, []);


  const handleLogin = () => {
    // console.log("SEND", Path);
    navigate("/login", { state: { returnPath: Path } });
  };

  const isUsernameValid = (username) => {
    return username.length >= 5;
  };
  
  const isPasswordValid = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };
  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };
  
  const collectData = async () => {
    setError(""); // Clear previous errors

    if (!isUsernameValid(username)) {
      setError("Username must be at least 5 characters long.");
      return;
    }
    
    if (!validateGmail(email)) {
      setError("Email must be a valid Gmail address.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Password must be at least 8 characters long, contain at least one uppercase letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      let result = await fetch('https://vit-parking-backend.vercel.app/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!result.ok) {
        throw new Error("Failed to sign up");
      }
      result = await result.json();
      localStorage.setItem("user", JSON.stringify(result.result));
      localStorage.setItem("token", result.token);
      navigate(Path);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="Login">
        <section>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <div className="signin">
            <div className="content">
              <h2>Sign Up</h2>
              {error && <p className="error">{error}</p>}
              <div className="form">
                <div className="inputBox">
                  <input type="text" required onChange={e => setUsername(e.target.value)} />
                  <i>Username*</i>
                </div>
                <div className="inputBox">
                  <input type="email" required onChange={e => setEmail(e.target.value)} />
                  <i>Email*</i>
                </div>
                <div className="inputBox">
                  <input type="password" required onChange={e => setPassword(e.target.value)} />
                  <i>Password*</i>
                </div>
                <div className="inputBox">
                  <input type="password" required onChange={e => setConfirmPassword(e.target.value)} />
                  <i>Confirm Password*</i>
                </div>
                <div className="links">
                  Already Have an account?
                    <a style={{ color: "#0f0", cursor: "pointer", fontWeight: 600 }} onClick={handleLogin}>Login</a>
                </div>
                <div className="inputBox">
                  <input type="submit" value="SignUp" onClick={collectData} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Temp;
