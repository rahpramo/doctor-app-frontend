import React, {useState} from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";

const strapiMediaUrl = process.env.REACT_APP_CLOUD_STRAPI_MEDIA_URL;
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
      </CardContent>
    </Card>
  );
});

DoctorCard.displayName = "DoctorCard";
export default DoctorCard;
