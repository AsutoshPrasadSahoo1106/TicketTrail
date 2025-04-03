import { useState } from "react";
import { Form, Button, Container, Image } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

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
    formData.append("profilePicture", profilePic); // Ensure this matches the backend field name

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Account created successfully!");
      e.target.reset();
      setProfilePic(null);
      setPreview(null);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container
      fluid
      className="signup-page d-flex align-items-center justify-content-center"
    >
      <div className="signup-container">
        <Form onSubmit={handleSignUp} className="p-4 border rounded shadow">
          <h1 className="text-center mb-4">Create Account</h1>

          <Form.Control
            type="text"
            placeholder="Name"
            name="name"
            required
            className="mb-3"
          />
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            required
            className="mb-3"
          />
          <Form.Select name="gender" required className="mb-3">
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
            className="mb-3"
          />
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            className="mb-3"
          />
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            className="mb-3"
            onChange={handlePasswordCheck}
          />
          {!passwordsMatch && (
            <p className="text-danger">Passwords do not match!</p>
          )}
          <Form.Select name="role" required className="mb-3">
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
          </Form.Select>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Profile Picture (Max: 2MB, JPG/PNG)</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
            {preview && (
              <Image
                src={preview}
                className="mt-3 rounded-circle"
                width={100}
                height={100}
              />
            )}
          </Form.Group>
          <Button type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Signup;