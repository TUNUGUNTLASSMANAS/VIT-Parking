import { useEffect, useState } from "react";
import "./bootstrap.css";
import "./login.css";
import "@fontsource/noto-sans";
import { Link, useNavigate, useLocation } from "react-router-dom";
const Temp = () => {
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const { returnPath = '/' } = location.state || {};
    useEffect(() => {
    // console.log(returnPath);
        // Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          navigate(returnPath);
        }
    }, []);

    // if (isLoggedIn) navigate('/');
    const isUsernameValid = (username) => {
      return username.length >= 5;
    };
  
    const isPasswordValid = (password) => {
      return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    };
    const handlesignup = () =>{
      // console.log("Here login: ",returnPath);
      navigate("/signup", { state: { returnPath: returnPath } });
    }
    const handleLogin = async () => {
      setError(""); // Clear previous errors
      if (!isUsernameValid(username)) {
        setError("Username must be at least 5 characters long.");
        return;
      }
  
      if (!isPasswordValid(password)) {
        setError("Password must be at least 8 characters long, contain at least one uppercase letter and one number.");
        return;
      }
      try {
        let result = await fetch('https://vit-parking-backend.vercel.app/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(errorText);
        }
  
        result = await result.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      // console.log("Login successful:", result);
      // console.log("Path",returnPath);
        navigate(returnPath); // Navigate to home page after successful login
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      }
    };
  
  return (
    <>
      <div className="Login">
        <section>
          {" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>{" "}
          <span></span> <span></span> <span></span> <span></span> <span></span>
          <div className="signin">
            <div className="content">
              <h2>Sign In</h2>
              
              <div className="form">
                <div className="inputBox">
                    <input type="text" required onChange={e => setusername(e.target.value)} />
                    <i>Username*</i>
                  </div>
                  <div className="inputBox">
                    <input type="password" required onChange={e => setPassword(e.target.value)} />
                    <i>Password*</i>
                  </div>
                <div className="links">
                  <a href="#">Forgot Password</a>
                </div>
                <div className="links">
                    Don't have an account?
                    <a style={{cursor: "pointer", color: "#0f0", fontWeight: 600 }} onClick={handlesignup}>
                      SignUp
                    </a>
                </div>
                {error && <div className="error">{error}</div>}
                <div className="inputBox">
                  <input type="submit" value="Login" onClick={handleLogin} />
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
