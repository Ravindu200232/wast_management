// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Verify token with backend and get fresh user data
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/profile"
      );
      setUser(response.data);
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  // Update the register function in your AuthContext
  const register = async (userData) => {
    try {
      // Prepare the data based on role
      const registrationData = {
        email: userData.email,
        password: userData.password,
        role: userData.role,
        full_name: userData.full_name,
        phone: userData.phone,
        address: userData.address,
        ...(userData.role === "resident" && {
          house_number: userData.house_number,
          street: userData.street,
          area: userData.area,
          city: userData.city,
          postal_code: userData.postal_code,
        }),
        ...(userData.role === "factory" && {
          company_name: userData.company_name,
          registration_number: userData.registration_number,
          business_address: userData.business_address,
          contact_person: userData.contact_person,
        }),
        ...(userData.role === "driver" && {
          license_number: userData.license_number,
          vehicle_type: userData.vehicle_type,
          experience_years: userData.experience_years,
        }),
      };

      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        registrationData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);

      return { success: true, userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
     window.location.href = '/login';
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/auth/profile",
        profileData
      );

      // Update user state with new data
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/auth/change-password",
        passwordData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password change failed",
      };
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/profile"
      );
      setUser(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
      return { success: true, user: response.data };
    } catch (error) {
      return {
        success: false,
        message: "Failed to refresh user data",
      };
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => user?.role === "admin";
  const isResident = () => user?.role === "resident";
  const isFactory = () => user?.role === "factory";
  const isDriver = () => user?.role === "driver";

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUserData,
    hasRole,
    isAdmin,
    isResident,
    isFactory,
    isDriver,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
