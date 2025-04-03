import { useState, useEffect } from "react";
import { Form, Button, Container, Image } from "react-bootstrap";
import { FaLinkedin, FaFacebook, FaGoogle, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginPage.css";

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => setIsActive(!isActive);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB");
        return;
      }

      const fileType = file.type.split("/")[1];
      if (!["jpeg", "jpg", "png"].includes(fileType)) {
        alert("Only JPG, JPEG, or PNG files are allowed");
        return;
      }

      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordCheck = (e) => {
    const password = document.querySelector('input[name="password"]').value;
    setPasswordsMatch(password === e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData(e.target);
    formData.append("profilePic", profilePic);

    try {
      const response = await fetch("/signup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Account created successfully!");
      setIsActive(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(await response.text());

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Welcome, ${user.name}!`);
      navigate(user.role === "organizer" ? "/dashboard" : "/events");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) navigate(user.role === "organizer" ? "/dashboard" : "/events");
  }, [navigate]);

  return (
    <Container fluid className="login-page d-flex align-items-center justify-content-center">
      <div className={`login-container ${isActive ? "active" : ""}`}>

        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <Form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaGoogle /></a>
              <a href="#"><FaGithub /></a>
            </div>
            <span>or use your email for registration</span>

            <Form.Control type="text" placeholder="Name" name="name" required />
            <Form.Control type="email" placeholder="Email" name="email" required />

            <Form.Select name="gender" required className="mt-2">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>

            <Form.Control 
              type="tel" 
              placeholder="Phone Number" 
              name="phone" 
              pattern="[0-9]{10}" 
              required 
              className="mt-2"
            />

            <Form.Control type="password" placeholder="Password" name="password" required className="mt-2" />
            <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" required className="mt-2" onChange={handlePasswordCheck} />
            {!passwordsMatch && <p className="text-danger">Passwords do not match!</p>}

            <Form.Select name="role" required className="mt-2">
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </Form.Select>

            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label>Upload Profile Picture (Max: 2MB, JPG/PNG)</Form.Label>
              <Form.Control type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
              {preview && <Image src={preview} className="mt-3 rounded-circle" width={100} height={100} />}
            </Form.Group>

            <Button type="submit" className="w-100 mt-3">Sign Up</Button>
          </Form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <Form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaGoogle /></a>
              <a href="#"><FaGithub /></a>
            </div>
            <span>or use your email password</span>
            <Form.Control type="email" placeholder="Email" name="email" required />
            <Form.Control type="password" placeholder="Password" name="password" required />
            <a href="#" className="d-block my-2">Forgot Your Password?</a>
            <Button type="submit" className="w-100 mt-3">Sign In</Button>
          </Form>
        </div>

        {/* Toggle Panel */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your details to continue</p>
              <Button variant="outline-light" onClick={toggleForm}>Sign In</Button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register to get started</p>
              <Button variant="outline-light" onClick={toggleForm}>Sign Up</Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
