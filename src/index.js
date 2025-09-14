import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AppointmentProvider } from "./context/AppointmentContext";
import { Provider } from "react-redux";
import store from "./redux/slices";

// Error Boundary component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AppointmentProvider>
          <App />
        </AppointmentProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Web Vitals reporting with better error handling
const vitalsConfig = {
  onPerfEntry: (metric) => {
    // Only report in production or if needed
    if (process.env.NODE_ENV === 'production') {
      console.log('Web Vitals:', metric);
      // Here you can send metrics to your analytics service
    }
  }
};

reportWebVitals(vitalsConfig);
