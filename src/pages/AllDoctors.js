import {useEffect, useState, useCallback, useMemo} from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {filters} from "../utils/constants";
import {useSelector} from "react-redux";
import {useApi} from "../hooks/useApi";
import {fetchDoctors} from "../services/data";
import DoctorCard from "../components/DoctorCard";

// Main AllDoctors component
const AllDoctors = () => {
  const navigate = useNavigate();
  const {speciality: urlSpeciality} = useParams();
  const [selectedFilter, setSelectedFilter] = useState(urlSpeciality || null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const storedDoctorsList = useSelector((state) => state.doctors.doctorsList);
  const {loading, error, callApi} = useApi();

  const loadDoctors = useCallback(async () => {
    await callApi(fetchDoctors);
  }, [callApi]);

  // Load doctors if not already in Redux store
  useEffect(() => {
    if (storedDoctorsList.length === 0) {
      loadDoctors();
    }
  }, [loadDoctors, storedDoctorsList.length]);

  // Filter doctors based on selected filter
  useEffect(() => {
    if (!storedDoctorsList.length) return;

    let filteredDoctorsList = storedDoctorsList;

    if (selectedFilter) {
      filteredDoctorsList = storedDoctorsList.filter(
        (doc) => doc.speciality === selectedFilter
      );
    }

    setFilteredDoctors(filteredDoctorsList);
  }, [selectedFilter, storedDoctorsList, storedDoctorsList?.length]);

  // Sync with URL parameter
  useEffect(() => {
    if (urlSpeciality) {
      setSelectedFilter(urlSpeciality);
    }
  }, [urlSpeciality]);

  const handleFilterChange = useCallback(
    (filter) => {
      setSelectedFilter(filter === selectedFilter ? null : filter);
    },
    [selectedFilter]
  );

  const clearFilter = useCallback(() => {
    setSelectedFilter(null);
  }, []);

  const handleDoctorClick = useCallback(
    (doctor) => {
      navigate(`/appointment/${doctor.uid || doctor.id}`);
    },
    [navigate]
  );

  const renderFilterButtons = useMemo(
    () => (
      <Box
        sx={{
          display: {xs: "none", sm: "flex"},
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            onClick={() => handleFilterChange(filter)}
            variant={selectedFilter === filter ? "filled" : "outlined"}
            color={selectedFilter === filter ? "primary" : "default"}
            sx={{
              cursor: "pointer",
              fontWeight: selectedFilter === filter ? 600 : 400,
              px: 2,
              py: 1.5,
            }}
          />
        ))}

        {selectedFilter && (
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilter}
            sx={{alignSelf: "center"}}
          >
            Clear Filter
          </Button>
        )}
      </Box>
    ),
    [selectedFilter, handleFilterChange, clearFilter]
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

  if (loading && storedDoctorsList.length === 0) {
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
      <Typography variant="h4" component="h1" sx={{mb: 2, fontWeight: 600}}>
        Our Medical Specialists
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
        Browse through our team of specialist doctors and book an appointment
        with the right professional for your needs.
      </Typography>

      {/* Filters Section */}
      {renderFilterButtons}

      {/* Mobile Filters */}
      <Box sx={{display: {xs: "block", sm: "none"}, mb: 3}}>
        <Typography variant="subtitle2" sx={{mb: 1, fontWeight: 600}}>
          Filter by specialty:
        </Typography>
        <ToggleButtonGroup
          value={selectedFilter}
          exclusive
          onChange={(e, value) => handleFilterChange(value)}
          aria-label="doctor specialty filter"
          sx={{flexWrap: "wrap", gap: 1}}
        >
          {filters.map((filter) => (
            <ToggleButton
              key={filter}
              value={filter}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 1,
              }}
            >
              {filter}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {selectedFilter && (
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilter}
            sx={{mt: 2}}
          >
            Clear Filter
          </Button>
        )}
      </Box>

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
        Showing {filteredDoctors.length} doctor
        {filteredDoctors.length !== 1 ? "s" : ""}
        {selectedFilter && ` in ${selectedFilter}`}
      </Typography>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <Grid container spacing={3}>
          {filteredDoctors.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id || doc.uid}>
              <DoctorCard doctor={doc} onClick={handleDoctorClick} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{textAlign: "center", py: 8}}>
          <Typography variant="h6" color="text.secondary" sx={{mb: 2}}>
            No doctors found
          </Typography>
          {selectedFilter && (
            <Button variant="outlined" onClick={clearFilter}>
              Clear filter
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default AllDoctors;
