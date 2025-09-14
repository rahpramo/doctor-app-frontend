import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  Stack,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Link
} from "@mui/material";
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
  Work as SpecialtyIcon,
  School as EducationIcon,
  Star as RatingIcon,
  AccessTime as AvailabilityIcon
} from "@mui/icons-material";
import BookingSection from "../components/BookingSection";
import { useSelector } from "react-redux";
import { useApi } from "../hooks/useApi";
import {  fetchDoctorById } from "../services/data";
import DoctorCard from "../components/DoctorCard";

const strapiMediaUrl = process.env.REACT_APP_CLOUD_STRAPI_MEDIA_URL

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const doctorsList = useSelector((state) => state.doctors.doctorsList);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { callApi } = useApi();

  // Load doctor details
  useEffect(() => {
    const loadDoctorDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let doctor = null;
        
        // First try to find doctor in Redux store
        if (doctorsList.length > 0) {
          doctor = doctorsList.find((doc) => doc.uid === doctorId || doc.id === doctorId);
        }
        
        // If not found in store, fetch directly from API
        if (!doctor) {
          const result = await callApi(fetchDoctorById, doctorId);
          if (result.success) {
            doctor = result.data;
          } else {
            throw new Error("Doctor not found");
          }
        }
        
        setSelectedDoctor(doctor);
        
        // Find related doctors (same specialty)
        const related = doctorsList.filter(
          (doc) => 
            (doc.uid !== doctorId && doc.id !== doctorId) && 
            doc.speciality === doctor.speciality
        );
        
        setRelatedDoctors(related.slice(0, 3)); // Limit to 3 related doctors
      } catch (err) {
        setError(err.message || "Failed to load doctor details");
        console.error("Error loading doctor:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadDoctorDetails();
    }
  }, [doctorId, doctorsList, callApi]);

  const handleBackClick = useCallback(() => {
    navigate(-1); // Go back to previous page
  }, [navigate]);

  const handleRelatedDoctorClick = useCallback((doctor) => {
    navigate(`/appointment/${doctor.uid || doctor.id}`);
    window.scrollTo(0, 0); // Scroll to top when navigating to new doctor
  }, [navigate]);

  // Breadcrumb navigation
  const breadcrumbs = useMemo(() => [
    <Link
      key="1"
      color="inherit"
      href="/"
      onClick={(e) => {
        e.preventDefault();
        navigate("/");
      }}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
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
      {selectedDoctor?.name || "Doctor"}
    </Typography>,
  ], [selectedDoctor, navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!selectedDoctor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Doctor not found
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate("/doctors")}
        >
          Browse Doctors
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        {breadcrumbs}
      </Breadcrumbs>

      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackClick}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Doctor Details */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardMedia
              component="img"
              height="320"
              image={!selectedDoctor.avatar ? `${strapiMediaUrl}/upload_area_8bc1382fd8.png` : selectedDoctor.avatar?.url}
              alt={selectedDoctor.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dr. {selectedDoctor.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <SpecialtyIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="primary.main">
                  {selectedDoctor.speciality}
                </Typography>
              </Stack>
              {selectedDoctor.experience && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <SpecialtyIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {selectedDoctor.experience} years experience
                  </Typography>
                </Stack>
              )}
              {selectedDoctor.qualifications && (
                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                  <EducationIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {selectedDoctor.qualifications}
                  </Typography>
                </Stack>
              )}
              {selectedDoctor.fee && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", mt: 2 }}>
                  <Typography variant="h6" color="primary.main" gutterBottom>
                    Consultation Fee
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedDoctor.fee}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Doctor Bio */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About Dr. {selectedDoctor.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                {selectedDoctor.about || "No biography available yet."}
              </Typography>
              
              {/* Additional doctor information could go here */}
              {selectedDoctor.services && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Services Offered
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {selectedDoctor.services.split(',').map((service, index) => (
                      <Chip 
                        key={index} 
                        label={service.trim()} 
                        size="small" 
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>

          {/* Booking Section */}
          <BookingSection selectedDoctor={selectedDoctor} />
        </Grid>
      </Grid>

      {/* Related Doctors */}
      {relatedDoctors.length > 0 && (
        <Box mt={8}>
          <Typography variant="h5" gutterBottom>
            Other {selectedDoctor.speciality} Specialists
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You might also be interested in these specialists
          </Typography>
          <Grid container spacing={3}>
            {relatedDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <DoctorCard 
                  doctor={doctor} 
                  onClick={handleRelatedDoctorClick}
                  showSpecialty={false} // Since they're all same specialty
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default React.memo(AppointmentPage);
