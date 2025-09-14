import React, { useState, useCallback, memo } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const Register = memo(({ onRegister, isLoading = false }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setError("");
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    onRegister?.(form);
  }, [form, onRegister]);

  return (
    <Container maxWidth="xs" component="main">
      <Paper 
        elevation={3} 
        sx={{ p: 4, mt: 8 }}
        aria-labelledby="register-title"
      >
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom
          id="register-title"
          component="h2"
        >
          Create User Account
        </Typography>

        {error && (
          <Typography 
            variant="body2" 
            color="error" 
            align="center"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mt: 2 }}
          noValidate
        >
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!error}
            disabled={isLoading}
            autoComplete="name"
            inputProps={{
              "aria-required": "true",
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!error}
            disabled={isLoading}
            autoComplete="email"
            inputProps={{
              "aria-required": "true",
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={!!error}
            disabled={isLoading}
            autoComplete="new-password"
            inputProps={{
              "aria-required": "true",
              minLength: 6,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!error}
            disabled={isLoading}
            autoComplete="new-password"
            inputProps={{
              "aria-required": "true",
            }}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
            aria-label="Register account"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
});

Register.displayName = "Register";

export default Register;
