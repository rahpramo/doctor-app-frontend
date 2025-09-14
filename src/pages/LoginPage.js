import React, {useState, useCallback, useMemo} from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import {Button, Box, Alert, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAppointments} from "../context/AppointmentContext";
import {loginUser} from "../redux/slices/userSlice";
import {useDispatch} from "react-redux";
import {AuthService} from "../services/AuthService";
import CloseIcon from "@mui/icons-material/Close";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {displayRegistrationForm, setDisplayRegistrationForm} =
    useAppointments();

  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized login handler
  const handleLogin = useCallback(
    async (data) => {
      setMessage("");
      setIsLoading(true);

      try {
        const result = await AuthService.login(data.email, data.password);

        if (result.success) {
          // Store token and user data
          localStorage.setItem("jwtToken", result.jwt);
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem("userType", result.user.userType || false);

          setMessage("Login successful!");
          dispatch(
            loginUser({
              isAdmin: result.user.userType === "admin",
              email: result.user.email,
            })
          );
          navigate("/"); // redirect after login
        } else {
          setMessage(`Login failed: ${result.error}`);
        }
      } catch (error) {
        setMessage("An unexpected error occurred during login");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate]
  );

  // Memoized admin login handler
  const handleAdminLogin = useCallback(() => {
    setDisplayRegistrationForm(false);
    const newIsAdmin = !isAdmin;
    setIsAdmin(newIsAdmin);

    if (newIsAdmin) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  }, [isAdmin, navigate, setDisplayRegistrationForm]);

  // Memoized register handler
  const handleRegister = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        const result = await AuthService.register({
          username: data.name,
          password: data.password,
          email: data.email,
        });

        if (result.success) {
          // Store token and user data
          localStorage.setItem("jwtToken", result.jwt);
          localStorage.setItem("user", JSON.stringify(result.user));
          setMessage("Registration successful! You are now logged in.");
          navigate("/");
        } else {
          setMessage(`Registration failed: ${result.error}`);
        }
      } catch (error) {
        setMessage("An unexpected error occurred during registration");
        console.error("Registration error:", error);
      } finally {
        setIsLoading(false);
        setDisplayRegistrationForm(false);
      }
    },
    [navigate, setDisplayRegistrationForm]
  );

  // Memoized toggle form handler
  const handleToggleForm = useCallback(() => {
    navigate("/login");
    setIsAdmin(false);
    setDisplayRegistrationForm(!displayRegistrationForm);
  }, [displayRegistrationForm, navigate, setDisplayRegistrationForm]);

  // Memoized alert severity
  const alertSeverity = useMemo(
    () =>
      message.includes("failed") || message.includes("error")
        ? "error"
        : "success",
    [message]
  );

  // Memoized form title
  const formTitle = useMemo(
    () => (isAdmin ? "Admin Login" : "Login"),
    [isAdmin]
  );

  // Memoized toggle button text
  const toggleButtonText = useMemo(
    () =>
      displayRegistrationForm
        ? "Already have an account? Login"
        : "Don't have an account? Register",
    [displayRegistrationForm]
  );

  // Memoized admin button text
  const adminButtonText = useMemo(
    () => (isAdmin ? "User Login" : "Admin Login"),
    [isAdmin]
  );

  return (
    <Box
      component="main"
      textAlign="center"
      mt={4}
      aria-labelledby="login-page-title"
    >
      <h1
        id="login-page-title"
        style={{visibility: "hidden", height: 0, margin: 0}}
      >
        {displayRegistrationForm ? "User Registration" : formTitle}
      </h1>

      {displayRegistrationForm ? (
        <Register onRegister={handleRegister} isLoading={isLoading} />
      ) : (
        <Login onLogin={handleLogin} title={formTitle} isLoading={isLoading} />
      )}

      <Box mt={2}>
        <Button
          onClick={handleToggleForm}
          variant="text"
          disabled={isLoading}
          aria-label={toggleButtonText}
        >
          {toggleButtonText}
        </Button>
      </Box>

      {!displayRegistrationForm && (
        <Box mt={1}>
          <Button
            onClick={handleAdminLogin}
            variant="text"
            disabled={isLoading}
            aria-label={`Switch to ${adminButtonText}`}
          >
            {adminButtonText}
          </Button>
        </Box>
      )}

      {message && (
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="Close alert"
              color="inherit"
              size="small"
              onClick={() => setMessage("")}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            mt: 2,
            width: {xs: "90%", sm: "70%", md: "50%"},
            margin: "0 auto",
          }}
          role="alert"
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default React.memo(LoginPage);
