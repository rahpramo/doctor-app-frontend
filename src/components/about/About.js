import React from "react";
import {Box, Typography, Grid, Paper} from "@mui/material";

const About = () => {
  return (
    <Box sx={{px: {xs: 2, md: 8}, py: 6}}>
      {/* ABOUT US Heading */}
      <Typography
        variant="h4"
        align="center"
        sx={{pt: 2, fontWeight: 400, color: "#707070"}}
      >
        ABOUT <span style={{color: "#374151", fontWeight: 600}}>US</span>
      </Typography>

      {/* About Section */}
      <Grid
        container
        spacing={6}
        sx={{my: 8}}
        alignItems="center"
        justifyContent="center"
      >
        {/* Left: Image */}
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src="/assets/about_image.png"
            alt="About Us"
            sx={{width: "100%", maxWidth: 360, borderRadius: 2, mx: "auto"}}
          />
        </Grid>

        {/* Right: Text */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              maxWidth: 600,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="body1" sx={{color: "text.secondary"}}>
              Welcome to Lotus, your trusted partner in managing your
              healthcare needs conveniently and efficiently. At Lotus, we
              understand the challenges individuals face when it comes to
              scheduling doctor appointments and managing their health records.
            </Typography>
            <Typography variant="body1" sx={{color: "text.secondary"}}>
              Lotus is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform, integrating the
              latest advancements to improve user experience and deliver
              superior service.
            </Typography>
            <Typography
              variant="h6"
              sx={{color: "text.primary", fontWeight: 600}}
            >
              Our Vision
            </Typography>
            <Typography variant="body1" sx={{color: "text.secondary"}}>
              Our vision at Lotus is to create a seamless healthcare
              experience for every user. We aim to bridge the gap between
              patients and healthcare providers, making it easier for you to
              access the care you need, when you need it.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* WHY CHOOSE US Heading */}
      <Typography
        variant="h5"
        align="center"
        sx={{my: 6, fontWeight: 400, color: "#333"}}
      >
        WHY <span style={{color: "#374151", fontWeight: 600}}>CHOOSE US</span>
      </Typography>

      {/* Why Choose Us Cards */}
      <Grid
        container
        spacing={2}
        sx={{mb: 10, maxWidth: 1200}}
        justifyContent="center"
      >
        {[
          {
            title: "EFFICIENCY:",
            desc: "Streamlined appointment scheduling that fits into your busy lifestyle.",
          },
          {
            title: "CONVENIENCE:",
            desc: "Access to a network of trusted healthcare professionals in your area.",
          },
          {
            title: "PERSONALIZATION:",
            desc: "Tailored recommendations and reminders to help you stay on top of your health.",
          },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper
              elevation={0}
              sx={{
                maxWidth:300,
                maxHeight:120,
                p: {xs: 1, sm: 2},
                textAlign: "center",
                border: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "rgb(95, 111, 255)",
                  color: "#fff",
                },
              }}
            >
              <Typography component="b" sx={{fontWeight: 600}}>
                {item.title}
              </Typography>
              <Typography>{item.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default About;
