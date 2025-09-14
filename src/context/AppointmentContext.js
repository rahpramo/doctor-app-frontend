// context/AppointmentContext.tsx
import React, {createContext, useContext, useState} from "react";

const AppointmentContext = createContext(
  undefined
);

export const AppointmentProvider = ({
  children,
}) => {

  const [displayRegistrationForm, setDisplayRegistrationForm] = useState(false);

  return (
    <AppointmentContext.Provider
      value={{ displayRegistrationForm, setDisplayRegistrationForm}}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const ctx = useContext(AppointmentContext);
  if (!ctx)
    throw new Error("useAppointments must be used within AppointmentProvider");
  return ctx;
};
