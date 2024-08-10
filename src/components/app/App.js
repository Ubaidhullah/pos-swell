import React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import Home from "../home/Home";
import LoginPage from "../login/LoginPage";

const App = ({ isLoggedIn }) => {
  const location = useLocation();

  const checkForAuth = () => {
    return isLoggedIn ? <Home /> : <LoginPage />;
  };

  return <React.Fragment>{checkForAuth()}</React.Fragment>;
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth && state.auth.tokens ? true : false
  };
};

export default connect(mapStateToProps)(App);
