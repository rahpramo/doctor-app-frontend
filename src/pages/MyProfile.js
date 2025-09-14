import React, {useEffect} from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { AuthService } from "../services/AuthService";

const ProfilePage = () => {
  const [userData, setUserData] = React.useState(null);
  // Example profile data (replace with your logged-in user data)
  const user = {
    name: "Rahul",
    email: "pawarrahul062@gmail.com",
    phone: "000000000",
    address: "",
    gender: "Not Selected",
    birthday: "Not Selected",
    avatar:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAA...", // base64 you provided
  };

  useEffect(() => {
    async function fetchData() {
      const userData = await AuthService.getCurrentUser();
      setUserData(userData?.user);
    }
    fetchData();
  }, []);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Container maxWidth="sm" sx={{pt: 5}}>
      <Paper sx={{p: 4, borderRadius: 3}}>
        {/* Avatar */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{width: 144, height: 144, borderRadius: 2}}
          />
          <Typography
            variant="h4"
            fontWeight="500"
            color="text.primary"
            sx={{mt: 3}}
          >
            {userData.username}
          </Typography>
        </Box>

        <Divider sx={{my: 3}} />

        {/* Contact Information */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{color: "text.secondary", textDecoration: "underline", mb: 2}}
          >
            CONTACT INFORMATION
          </Typography>
          <Grid container spacing={2} sx={{color: "#363636"}}>
            <Grid item xs={4} fontWeight="500">
              Email id:
            </Grid>
            <Grid item xs={8} sx={{color: "primary.main"}}>
              {userData.email}
            </Grid>

            <Grid item xs={4} fontWeight="500">
              Phone:
            </Grid>
            <Grid item xs={8} sx={{color: "primary.main"}}>
              {user.phone}
            </Grid>

            <Grid item xs={4} fontWeight="500">
              Address:
            </Grid>
            <Grid item xs={8} sx={{color: "text.secondary"}}>
              {user.address || "—"}
            </Grid>
          </Grid>
        </Box>

        {/* Basic Information */}
        <Box mt={4}>
          <Typography
            variant="subtitle2"
            sx={{color: "text.secondary", textDecoration: "underline", mb: 2}}
          >
            BASIC INFORMATION
          </Typography>
          <Grid container spacing={2} sx={{color: "text.secondary"}}>
            <Grid item xs={4} fontWeight="500">
              Gender:
            </Grid>
            <Grid item xs={8}>
              {user.gender}
            </Grid>

            <Grid item xs={4} fontWeight="500">
              Birthday:
            </Grid>
            <Grid item xs={8}>
              {user.birthday}
            </Grid>
          </Grid>
        </Box>

        {/* Edit Button */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="outlined"
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 999,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {bgcolor: "primary.main", color: "white"},
            }}
          >
            Edit
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
