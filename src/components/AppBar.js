import React, {useState, useEffect, useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle,
  Menu as MenuIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon,
  Person as ProfileIcon,
  CalendarToday as AppointmentsIcon,
} from "@mui/icons-material";
import {logoutUser} from "../redux/slices/userSlice";
import {setDoctors} from "../redux/slices/doctorSlice";
import {createDoc, fetchDoctors} from "../services/data";
import {AuthService} from "../services/AuthService";

// Navigation links configuration
const userLinks = [
  {title: "HOME", path: "/", icon: <HomeIcon />},
  {title: "DOCTORS", path: "/doctors"},
  {title: "ABOUT", path: "/about"},
  {title: "CONTACT", path: "/contact"},
];

const adminLinks = [
  {title: "HOME", path: "/", icon: <HomeIcon />},
  {title: "APPOINTMENTS", path: "/all-appointments"},
  {title: "ABOUT", path: "/about"},
  {title: "CONTACT", path: "/contact"},
];

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [token, setToken] = useState("");
  const [adminUser, setAdminUser] = useState(false);
  const [navLinks, setNavLinks] = useState(userLinks);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  // Check authentication status on component mount and when token changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      const isAdmin = AuthService.isAdmin();
      const userToken = localStorage.getItem("jwtToken");
      setToken(userToken || "");
      setAdminUser(isAdmin);
      setNavLinks(isAdmin ? adminLinks : userLinks);
      loadDoctors();
    };

    checkAuthStatus();

    // Listen for storage changes (e.g., login/logout in other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loggedIn]); // Added loggedIn to dependencies to re-check auth status on login/logout

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchDoctors();
      if (result.success) {
        dispatch(setDoctors(result.data));
      } else {
        console.error("Failed to load doctors:", result.error);
      }
    } catch (err) {
      console.error("Failed to load doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // Use the AuthService for consistent logout behavior
      const result = AuthService.logout();

      if (result.success) {
        dispatch(logoutUser());
        setAnchorEl(null);
        setDrawerOpen(false);
        setToken("");
        setAdminUser(false);
        setNavLinks(userLinks);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout even if there's an error
      localStorage.clear();
      dispatch(logoutUser());
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setDrawerOpen(false);
      handleMenuClose();
    },
    [navigate, handleMenuClose]
  );

  const renderDesktopNavItem = useCallback(
    (item) => {
      const shouldRender = item.title !== "HOME" || token;
      if (!shouldRender) return null;

      return (
        <Button
          key={item.title}
          onClick={() => handleNavigation(item.path)}
          sx={{
            color: "#000B6D",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(0, 11, 109, 0.04)",
            },
          }}
          aria-label={item.title.toLowerCase()}
        >
          {item.title}
        </Button>
      );
    },
    [token, handleNavigation]
  );

  const renderMobileNavItem = useCallback(
    (item) => {
      const shouldRender = item.title !== "HOME" || token;

      if (!shouldRender) return null;

      return (
        <ListItem
          button
          key={item.title}
          onClick={() => handleNavigation(item.path)}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(0, 11, 109, 0.04)",
            },
          }}
          aria-label={item.title.toLowerCase()}
        >
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{fontWeight: 500}}
          />
        </ListItem>
      );
    },
    [token, handleNavigation]
  );

  const renderUserMenu = useMemo(() => {
    if (!token) return null;

    return (
      <>
        <IconButton
          onClick={handleMenuOpen}
          aria-label="user account menu"
          aria-controls="user-menu"
          aria-haspopup="true"
          sx={{color: "#000B6D"}}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : <AccountCircle />}
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 180,
            },
          }}
          transformOrigin={{horizontal: "right", vertical: "top"}}
          anchorOrigin={{horizontal: "right", vertical: "bottom"}}
        >
          <MenuItem
            onClick={() => handleNavigation("/my-profile")}
            sx={{gap: 1}}
          >
            <ProfileIcon fontSize="small" />
            My Profile
          </MenuItem>
          {!adminUser && (
            <MenuItem
              onClick={() => handleNavigation("/my-appointments")}
              sx={{gap: 1}}
            >
              <AppointmentsIcon fontSize="small" />
              My Appointments
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout} sx={{gap: 1, color: "error.main"}}>
            <LogoutIcon fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  }, [
    token,
    adminUser,
    anchorEl,
    loading,
    handleMenuOpen,
    handleMenuClose,
    handleNavigation,
    handleLogout,
  ]);

  const renderMobileDrawer = useMemo(
    () => (
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        <Box
          sx={{
            width: 280,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
        >
          <Box sx={{p: 2, borderBottom: 1, borderColor: "divider"}}>
            <Typography variant="h6" color="#000B6D" fontWeight="bold">
              🏥 Lotus Medical
            </Typography>
          </Box>

          <List sx={{flexGrow: 1}}>{navLinks.map(renderMobileNavItem)}</List>

          <Box sx={{p: 2, borderTop: 1, borderColor: "divider"}}>
            {!token ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNavigation("/login")}
                sx={{
                  backgroundColor: "rgb(95, 111, 255)",
                  "&:hover": {
                    backgroundColor: "rgb(70, 90, 255)",
                  },
                }}
                aria-label="Create account"
              >
                Create Account
              </Button>
            ) : (
              <>
                <ListItem
                  button
                  onClick={() => handleNavigation("/my-profile")}
                  sx={{borderRadius: 1}}
                >
                  <ListItemText
                    primary="My Profile"
                    primaryTypographyProps={{fontWeight: 500}}
                  />
                </ListItem>
                {!adminUser && (
                  <ListItem
                    button
                    onClick={() => handleNavigation("/my-appointments")}
                    sx={{borderRadius: 1}}
                  >
                    <ListItemText
                      primary="My Appointments"
                      primaryTypographyProps={{fontWeight: 500}}
                    />
                  </ListItem>
                )}
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{mt: 1}}
                  aria-label="Logout"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={16} /> : "Logout"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    ),
    [
      drawerOpen,
      navLinks,
      renderMobileNavItem,
      token,
      adminUser,
      loading,
      handleNavigation,
      handleLogout,
    ]
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          color: "#000B6D",
        }}
        elevation={0}
      >
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              color: "#000B6D",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => navigate("/")}
            role="link"
            aria-label="Home page"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/");
              }
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#000B6D",
                fontSize: "1rem",
              }}
            >
              🏥
            </Avatar>
            Lotus Medical
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: {xs: "none", md: "flex"},
              gap: 2,
              alignItems: "center",
            }}
          >
            {navLinks.map(renderDesktopNavItem)}
            {renderUserMenu}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            edge="end"
            sx={{
              display: {xs: "flex", md: "none"},
              color: "#000B6D",
            }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {renderMobileDrawer}
    </>
  );
};

export default React.memo(NavBar);
