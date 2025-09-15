import React, {useEffect, useState, useCallback} from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  Work as ExperienceIcon,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../redux/slices/userSlice";
import Hero from "./Hero";
import SpecialitySection from "./SpecialitySection";
import {useApi} from "../../hooks/useApi";
import {fetchDoctors} from "../../services/data";
import {AuthService} from "../../services/AuthService";

const strapiMediaUrl = process.env.REACT_APP_CLOUD_STRAPI_MEDIA_URL;

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctorsList = useSelector((state) => state.doctors.doctorsList);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const {callApi, loading, error} = useApi();

  // Check authentication status and restore session
  useEffect(() => {
    const restoreSession = () => {
      try {
        const isAuthenticated = AuthService.isAuthenticated();

        if (isAuthenticated) {
          const userData = AuthService.getStoredUser();
          const isAdmin = AuthService.isAdmin();

          if (userData) {
            dispatch(
              loginUser({
                isAdmin: isAdmin,
                email: userData.email,
                username: userData.username,
                id: userData.id,
              })
            );
          }
        }
      } catch (err) {
        console.error("Error restoring session:", err);
        // Clear invalid auth data
        AuthService.logout();
      }
    };

    restoreSession();
  }, [dispatch]);

  // Load doctors if not in Redux store
  useEffect(() => {
    const loadDoctors = async () => {
      if (doctorsList.length === 0) {
        await callApi(fetchDoctors);
      }
    };

    loadDoctors();
  }, [doctorsList.length, callApi]);

  // Select featured doctors (top 4 with highest rating or most experience)
  useEffect(() => {
    if (doctorsList.length > 0) {
      const featured = [...doctorsList]
        .sort((a, b) => {
          // Prioritize doctors with ratings, then experience
          const aScore = (a.rating || 0) + (a.experience || 0);
          const bScore = (b.rating || 0) + (b.experience || 0);
          return bScore - aScore;
        })
        .slice(0, 4); // Top 4 doctors

      setFeaturedDoctors(featured);
    }
  }, [doctorsList]);

  const handleDoctorClick = useCallback(
    (doctor) => {
      navigate(`/appointment/${doctor.uid || doctor.id}`);
    },
    [navigate]
  );

  const handleBrowseAllClick = useCallback(() => {
    navigate("/doctors");
  }, [navigate]);

  const renderDoctorCard = useCallback(
    (doctor) => {
      const hasImage = doctor.avatar?.url;

      return (
        <Card
          key={doctor.id}
          sx={{
            maxWidth: 345,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
          onClick={() => handleDoctorClick(doctor)}
        >
          <CardMedia
            component="img"
            alt={doctor.name}
            height="220"
            image={
              !hasImage || !doctor.avatar
                ? `${strapiMediaUrl}/upload_area_8bc1382fd8.png`
                : doctor.avatar?.url
            }
            sx={{
              objectFit: hasImage ? "cover" : "contain",
              bgcolor: hasImage ? "transparent" : "grey.100",
            }}
          />
          <CardContent sx={{flexGrow: 1}}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {doctor.name}
            </Typography>
            <Typography
              variant="body2"
              color="primary.main"
              fontWeight="500"
              gutterBottom
            >
              {doctor.speciality}
            </Typography>

            <Box sx={{display: "flex", gap: 1, flexWrap: "wrap", mt: 1}}>
              {doctor.rating && (
                <Chip
                  icon={<StarIcon />}
                  label={doctor.rating}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
              {doctor.experience && (
                <Chip
                  icon={<ExperienceIcon />}
                  label={`${doctor.experience}yrs`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      );
    },
    [handleDoctorClick]
  );

  if (error) {
    return (
      <Container maxWidth="xl" sx={{px: {xs: 2, sm: 3}, py: 4}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
      <Container maxWidth="xl" sx={{px: {xs: 2, sm: 3}, flex: 1}}>
        {/* Hero Banner */}
        <Hero />

        {/* Speciality Section */}
        <SpecialitySection />

        {/* Top Doctors Section */}
        <Container sx={{py: 8}}>
          <Box sx={{textAlign: "center", mb: 6}}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              fontWeight="600"
            >
              Our Top Doctors
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{maxWidth: 600, mx: "auto", mb: 4}}
            >
              Meet our experienced medical professionals dedicated to your
              health and well-being
            </Typography>
          </Box>

          {loading && doctorsList.length === 0 ? (
            <Box sx={{display: "flex", justifyContent: "center", py: 8}}>
              <CircularProgress />
            </Box>
          ) : featuredDoctors.length > 0 ? (
            <>
              <Grid container spacing={4} justifyContent="center">
                {featuredDoctors.map(renderDoctorCard)}
              </Grid>

              <Box sx={{textAlign: "center", mt: 6}}>
                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleBrowseAllClick}
                  sx={{px: 4, py: 1.5}}
                >
                  Browse All Doctors
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{textAlign: "center", py: 4}}>
              <Typography variant="h6" color="text.secondary">
                No doctors available at the moment
              </Typography>
            </Box>
          )}
        </Container>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 4,
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1">
            © {new Date().getFullYear()} Lotus Medical. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{opacity: 0.8}}>
            Providing quality healthcare services
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default React.memo(HomePage);
