import React, { useState, useCallback, memo } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const Login = memo(({ onLogin, title, isLoading = false }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setError("");
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    onLogin?.(form);
  }, [form, onLogin]);

  return (
    <Container maxWidth="xs" component="main">
      <Paper 
        elevation={3} 
        sx={{ p: 4, mt: 8 }}
        aria-labelledby="login-title"
      >
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom
          id="login-title"
          component="h2"
        >
          {title}
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
            autoComplete="current-password"
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
            aria-label="Sign in"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
});

Login.displayName = "Login";

export default Login;
