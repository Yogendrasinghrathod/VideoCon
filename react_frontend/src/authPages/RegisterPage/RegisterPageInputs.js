import React from "react";
import PropTypes from "prop-types";
import InputWithLabel from "../../shared/components/InputWithLabel";
import { Box } from "@mui/material";

const RegisterPageInputs = (props) => {
  const { mail, setMail, username, setUsername, password, setPassword } = props;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <InputWithLabel
        value={mail}
        setValue={setMail}
        label="E-mail address"
        type="email"
        placeholder="Enter e-mail address"
        fullWidth
        required
        inputProps={{
          autoComplete: "email"
        }}
      />
      <InputWithLabel
        value={username}
        setValue={setUsername}
        label="Username"
        type="text"
        placeholder="Enter a username"
        fullWidth
        required
        inputProps={{
          autoComplete: "username"
        }}
      />
      <InputWithLabel
        value={password}
        setValue={setPassword}
        label="Password"
        type="password"
        placeholder="Enter password"
        fullWidth
        required
        inputProps={{
          autoComplete: "new-password"
        }}
      />
    </Box>
  );
};

RegisterPageInputs.propTypes = {
  mail: PropTypes.string.isRequired,
  setMail: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired
};

export default RegisterPageInputs;