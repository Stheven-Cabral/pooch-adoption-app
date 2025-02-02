"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Form, Container, Alert } from "react-bootstrap";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: name,
      email: email,
    };

    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        data,
        { withCredentials: true }
      );
      if (response.status === 200) {
        router.push("/search");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Failed to authenticate. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h1>Login</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin} role="form">
        <Form.Group controlId="formName" className="mt-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Name"
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
        </Form.Group>
        <button type="submit" className="my-3">
          Login
        </button>
      </Form>
    </Container>
  );
};

export default Login;
