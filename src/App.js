import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Spinner from "./components/shared/Spinner";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import PublicRoute from "./components/navigation/PublicRoute";
import NavBar from "./components/navigation/AppBar";


// Lazy load pages for better performance
const HomePage = lazy(() => import("./components/home/HomePage"));
const LoginPage = lazy(() => import("./components/authentication/LoginPage"));
const About = lazy(() => import("./components/about/About"));
const ContactUs = lazy(() => import("./components/contact/ContactUs"));
const AllDoctors = lazy(() => import("./components/doctor/AllDoctors"));
const AppointmentPage = lazy(() => import("./components/doctor/DoctorInfo"));
const ProfilePage = lazy(() => import("./components/profile/MyProfile"));
const MyAppointments = lazy(() => import("./components/appointment/MyAppointments"));
const AllAppointment = lazy(() => import("./components/appointment/AllAppointments"));
const FilteredDoctors = lazy(() => import("./components/doctor/FilteredDoctors"));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
    <Spinner />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <NavBar />
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route 
            path="/about" 
            element={<About />} 
          />
          <Route 
            path="/contact" 
            element={<ContactUs />} 
          />
          <Route 
            path="/doctors" 
            element={<AllDoctors />} 
          />
          <Route 
            path="/doctors/:speciality" 
            element={<FilteredDoctors />} 
          />

          {/* Protected Routes */}
          <Route
            path="/appointment/:doctorId"
            element={
              <ProtectedRoute>
                <AppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-appointments"
            element={
              <ProtectedRoute>
                <AllAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Route */}
          <Route
            path="*"
            element={
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default React.memo(App);
