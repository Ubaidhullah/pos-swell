import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { withStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import ErrorMessage from "../controls/messages/ErrorMessage";
import { loginUser } from "../../actions/auth";
import styles from "./styles";

const LoginPage = ({ classes, isLoggedIn, loginUser }) => {
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const hasErrors = () => errors.global && errors.global.length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(data);
    setErrors(errors);

    if (Object.keys(errors).length !== 0) {
      return;
    }

    setLoading(true);

    try {
      await loginUser({ ...data });
      navigate("/");
    } catch (error) {
      setErrors({ global: error.message });
      setData({ username: "", password: "" });
      setLoading(false);

      if (usernameRef.current) usernameRef.current.focus();
    }
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = (data) => {
    const errors = {};

    if (!data.username || data.username.length === 0)
      errors.username = "Enter username";

    if (!data.password || data.password.length === 0)
      errors.password = "Enter password";

    return errors;
  };

  return (
    <div className={classes.root}>
      <div className={classes.loginContainer}>
        <Paper className={classes.paper}>
          <form onSubmit={onSubmit}>
            <div>
              <span>Welcome to SWELL POS</span>
            </div>

            <ErrorMessage
              show={hasErrors()}
              className={classes.errorMessage}
              message={errors.global}
            />

            <TextField
              inputRef={usernameRef}
              error={!!errors.username}
              name="username"
              value={data.username}
              fullWidth
              label="Username"
              placeholder="Username"
              margin="normal"
              onChange={onChange}
            />
            <TextField
              error={!!errors.password}
              name="password"
              value={data.password}
              fullWidth
              label="Password"
              placeholder="Password"
              type="password"
              margin="normal"
              onChange={onChange}
            />

            <div className={classes.wrapper}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Login
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const isLoggedIn = state.auth !== undefined ? !!state.auth.tokens : false;
  return { isLoggedIn };
};

export default connect(mapStateToProps, { loginUser })(
  withStyles(styles, { withTheme: true })(LoginPage)
);
