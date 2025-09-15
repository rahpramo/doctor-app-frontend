import React from "react";
import {Box, Button, Container, Grid, Typography} from "@mui/material";

const Hero = () => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(95, 111, 255, var(--tw-bg-opacity, 1))",
        borderRadius: 2,
        px: {xs: 3, md: 6, lg: 10},
        py: {xs: 5, md: "8vw"},
        mt: 3, // gap from AppBar
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="white"
              gutterBottom
              sx={{lineHeight: 1.2}}
            >
              Book Appointment <br /> With Trusted Doctors
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              gap={2}
              color="white"
              sx={{fontSize: "0.9rem", mb: 3}}
            >
              <img
                src="/assets/group_profiles.png"
                alt="Doctors group"
                style={{width: "100px"}}
              />
              <Typography variant="body2">
                Simply browse through our extensive list of trusted doctors,
                <br />
                schedule your appointment hassle-free.
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "#595959",
                borderRadius: "999px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "0.3s",
                },
              }}
              href="#speciality"
            >
              Book Appointment →
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="/assets/header_img.png"
              alt="Doctor illustration"
              style={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: "16px",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
