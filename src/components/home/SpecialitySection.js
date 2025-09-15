import React from "react";
import {Box, Typography, Link, Avatar} from "@mui/material";
import { specialities } from "../../utils/constants";

const SpecialitySection = () => {
  return (
    <Box
      id="speciality"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 8,
        color: "#262626",
      }}
    >
      {/* Heading */}
      <Typography variant="h4" fontWeight={500} gutterBottom>
        Find by Speciality
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{maxWidth: {sm: "33%"}}}
      >
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </Typography>

      {/* Specialities Scrollable Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: {xs: "flex-start", sm: "center"},
          gap: 3,
          pt: 4,
          width: "100%",
          overflowX: "auto",
        }}
      >
        {specialities.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            underline="none"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.5s",
              "&:hover": {
                transform: "translateY(-10px)",
              },
            }}
          >
            <Avatar
              src={item.img}
              alt={item.name}
              sx={{
                width: {xs: 64, sm: 96},
                height: {xs: 64, sm: 96},
                mb: 1,
              }}
              variant="circular"
            />
            <Typography variant="caption" sx={{fontSize: "0.8rem"}}>
              {item.name}
            </Typography>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default SpecialitySection;
