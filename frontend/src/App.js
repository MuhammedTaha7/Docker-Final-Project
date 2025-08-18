import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalRoutes from "./Routes/global";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { CookiesProvider } from "react-cookie";
import { ChatProvider } from "./Context/ChatContext.jsx";

const App = () => {
  return (
    <CookiesProvider>
      <Router>
        <AuthProvider>
          <ChatProvider>
            <GlobalRoutes />
          </ChatProvider>
        </AuthProvider>
      </Router>
    </CookiesProvider>
  );
};

export default App;