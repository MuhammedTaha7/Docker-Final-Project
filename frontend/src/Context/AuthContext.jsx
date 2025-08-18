import { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["jwtToken"]);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") return;

    async function fetchUser() {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/user", {
          withCredentials: true,
        });
        
        // Map the backend field names to frontend expected names
        const userData = {
          token: cookies.jwtToken,
          ...response.data,
          // Map profile_pic to profilePic for consistency
          profilePic: response.data.profile_pic || response.data.profilePic
        };
        
        console.log("Fetched user data:", userData);
        setAuthData(userData);
      } catch (err) {
        console.error("User fetch failed", err);
        removeCookie("jwtToken", { path: "/" });
        setAuthData(null);
      }
      setLoading(false);
    }

    fetchUser();
  }, [cookies.jwtToken, location.pathname]);

  const loginUser = (data) => {
    // Also map profile_pic to profilePic on login
    const mappedData = {
      ...data,
      profilePic: data.profile_pic || data.profilePic
    };
    setAuthData(mappedData);
    setCookie("jwtToken", data.token, {
      path: "/",
      secure: false,
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60,
    });
  };

  const logoutUser = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setAuthData(null);
    removeCookie("jwtToken", { path: "/" });
  };

  return (
    <AuthContext.Provider value={{ authData, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Add and export this custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


