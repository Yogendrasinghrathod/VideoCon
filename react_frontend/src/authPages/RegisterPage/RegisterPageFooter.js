import React from "react";
import PropTypes from "prop-types";
import CustomPrimaryButton from "../../shared/components/CustomPrimaryButton";
import RedirectInfo from "../../shared/components/RedirectInfo";
import { Tooltip, Typography, Box, CircularProgress } from "@mui/material";

const getFormNotValidMessage = () => {
  return "Username should contain between 3 and 12 characters, and password should contain between 6 and 12 characters. Also, a correct email address should be provided.";
};

const getFormValidMessage = () => {
  return "Press to register!";
};

const RegisterPageFooter = ({ handleRegister, isFormValid, navigate, isLoading }) => {
  const handlePushToLoginPage = () => {
    navigate("/login");
  };

  return (
    <>
      <Tooltip
        title={!isFormValid ? getFormNotValidMessage() : getFormValidMessage()}
        aria-label={!isFormValid ? getFormNotValidMessage() : getFormValidMessage()}
      >
        <div>
          <CustomPrimaryButton
            label={isLoading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            additionalStyles={{ 
              marginTop: "30px", 
              padding: "12px 24px",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              width: "100%",
              fontSize: "16px"
            }}
            disabled={!isFormValid || isLoading}
            onClick={handleRegister}
            aria-disabled={!isFormValid || isLoading}
          />
        </div>
      </Tooltip>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          margin: '16px 0'
        }}
      >
        <RedirectInfo
          text=""
          redirectText="Already have an account? Sign in"
          additionalStyles={{ 
            marginTop: "10px",
            color: "#90caf9",
            cursor: "pointer"
          }}
          redirectHandler={handlePushToLoginPage}
        />
      </Box>
    </>
  );
};

// Adding prop types to validate props passed to the component
RegisterPageFooter.propTypes = {
  handleRegister: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

RegisterPageFooter.defaultProps = {
  isLoading: false
};

export default RegisterPageFooter;
