import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

const ContactUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Heading */}
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#707070", fontWeight: 400, mb: 6 }}
      >
        CONTACT <span style={{ color: "#374151", fontWeight: 600 }}>US</span>
      </Typography>

      {/* Content */}
      <Grid
        container
        spacing={6}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 12 }}
      >
        {/* Left: Image */}
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src="/assets/contact_image.png"
            alt="Contact Us"
            sx={{ width: "100%", maxWidth: 360, borderRadius: 2, mx: "auto" }}
          />
        </Grid>

        {/* Right: Info */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Office Info */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              OUR OFFICE
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              00000 NYD Station <br /> Block 12, NYD, USA
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Tel: (000) 000-0000 <br /> Email: lotus@gmail.com
            </Typography>

            {/* Careers Info */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.secondary", mt: 2 }}
            >
              CAREERS AT LOTUS
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Learn more about our teams and job openings.
            </Typography>

            {/* Button */}
            <Button
              variant="outlined"
              sx={{
                px: 4,
                py: 1.5,
                textTransform: "none",
                borderColor: "black",
                color: "black",
                "&:hover": {
                  bgcolor: "black",
                  color: "white",
                  borderColor: "black",
                },
              }}
            >
              Explore Jobs
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;
