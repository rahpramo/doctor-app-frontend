import React, {useEffect, useState, useCallback, useMemo} from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useApi} from "../hooks/useApi";
import {fetchDoctors} from "../services/data";
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

const strapiMediaUrl = process.env.REACT_APP_CLOUD_STRAPI_MEDIA_URL;

const FilteredDoctors = () => {
  const navigate = useNavigate();
  const {speciality} = useParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const doctorsList = useSelector((state) => state.doctors.doctorsList);
  const {loading, error, callApi} = useApi();

  const loadDoctors = useCallback(async () => {
    await callApi(fetchDoctors);
  }, [callApi]);

  useEffect(() => {
    if (doctorsList.length === 0) {
      loadDoctors();
    }
  }, [doctorsList.length, loadDoctors]);

  // Filter doctors based on URL parameter
  useEffect(() => {
    if (!doctorsList.length || !speciality) return;

    const filtered = doctorsList.filter((doc) => doc.speciality === speciality);

    setFilteredDoctors(filtered);
  }, [speciality, doctorsList]);

  const handleDoctorClick = useCallback(
    (doctor) => {
      navigate(`/appointment/${doctor.uid || doctor.id}`);
    },
    [navigate]
  );

  const handleBrowseAllClick = useCallback(() => {
    navigate("/doctors");
  }, [navigate]);

  // Breadcrumb navigation
  const breadcrumbs = useMemo(
    () => [
      <Link
        key="1"
        color="inherit"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        sx={{display: "flex", alignItems: "center"}}
      >
        <HomeIcon sx={{mr: 0.5}} fontSize="inherit" />
        Home
      </Link>,
      <Link
        key="2"
        color="inherit"
        href="/doctors"
        onClick={(e) => {
          e.preventDefault();
          navigate("/doctors");
        }}
      >
        Doctors
      </Link>,
      <Typography key="3" color="text.primary">
        {speciality}
      </Typography>,
    ],
    [speciality, navigate]
  );

  if (error) {
    return (
      <Container maxWidth="lg" sx={{py: 6}}>
        <Alert severity="error" sx={{mb: 3}}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDoctors}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (loading && doctorsList.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{py: 6, display: "flex", justifyContent: "center"}}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{py: 6}}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{mb: 3}}
      >
        {breadcrumbs}
      </Breadcrumbs>

      <Typography variant="h4" component="h1" sx={{mb: 2, fontWeight: 600}}>
        {speciality} Specialists
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
        Our team of expert {speciality.toLowerCase()} specialists is ready to
        provide you with the best care.
      </Typography>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
        Found {filteredDoctors.length} {speciality.toLowerCase()} specialist
        {filteredDoctors.length !== 1 ? "s" : ""}
      </Typography>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id || doctor.uid}>
              <DoctorCard doctor={doctor} onClick={handleDoctorClick} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{textAlign: "center", py: 8}}>
          <Typography variant="h6" color="text.secondary" sx={{mb: 2}}>
            No {speciality.toLowerCase()} specialists found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
            We don't have any doctors specializing in {speciality.toLowerCase()}{" "}
            at the moment.
          </Typography>
          <Button
            variant="contained"
            onClick={handleBrowseAllClick}
            sx={{mr: 2}}
          >
            Browse All Doctors
          </Button>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </Box>
      )}
    </Container>
  );
};

// Reusable DoctorCard Component (same as in AllDoctors)
const DoctorCard = React.memo(({doctor, onClick}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    onClick(doctor);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        border: "1px solid #C9D8FF",
        borderRadius: 3,
        transition: "0.3s",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardMedia
        component="img"
        image={
          imageError || !doctor.avatar
            ? `${strapiMediaUrl}/upload_area_8bc1382fd8.png`
            : doctor.avatar?.url
        }
        alt={doctor.name}
        onError={handleImageError}
        sx={{
          bgcolor: "#EAEFFF",
          height: 200,
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
      <CardContent sx={{flexGrow: 1}}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Chip
            size="small"
            label="Available"
            color="success"
            variant="outlined"
          />
        </Box>
        <Typography
          variant="h6"
          sx={{color: "#262626", fontWeight: 600, mb: 1}}
        >
          {doctor.name}
        </Typography>
        <Typography
          variant="body2"
          color="primary.main"
          sx={{fontWeight: 500, mb: 1}}
        >
          {doctor.speciality}
        </Typography>
        {doctor.experience && (
          <Typography variant="body2" color="text.secondary">
            {doctor.experience} years of experience
          </Typography>
        )}
        {doctor.qualifications && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{mt: 1, fontStyle: "italic"}}
          >
            {doctor.qualifications}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

DoctorCard.displayName = "DoctorCard";

export default FilteredDoctors;
