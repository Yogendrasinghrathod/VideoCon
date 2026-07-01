import React, { useState, useEffect } from "react";
import { Typography, Paper, Box } from "@mui/material";
import AuthBox from "../../shared/components/AuthBox";
import RegisterPageInputs from "./RegisterPageInputs";
import RegisterPageFooter from "./RegisterPageFooter";
import { validateRegisterForm } from "../../shared/utils/validators";
import { useDispatch } from "react-redux";
import { getActions } from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    setIsLoading(true);
    setError("");
    console.log("register clicked");
    
    const userDetails = {
      mail,
      password,
      username,
    };

    const actions = getActions(dispatch);
    actions.register(userDetails, navigate)
      .catch(err => {
        setError(err?.response?.data || "Registration failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsFormValid(
      validateRegisterForm({
        mail,
        username,
        password,
      })
    );
  }, [mail, username, password]);

  return (
    <AuthBox>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          borderRadius: '16px',
          backgroundColor: 'rgba(36, 37, 38, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: "white", 
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 3
          }}
        >
          Create an account
        </Typography>
        
        {error && (
          <Box 
            sx={{ 
              backgroundColor: 'rgba(211, 47, 47, 0.2)', 
              color: '#f44336', 
              padding: 2, 
              borderRadius: 1, 
              marginBottom: 2 
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        
        <RegisterPageInputs
          mail={mail}
          setMail={setMail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
        
        <RegisterPageFooter
          handleRegister={handleRegister}
          isFormValid={isFormValid}
          navigate={navigate}
          isLoading={isLoading}
        />
      </Paper>
    </AuthBox>
  );
};

export default RegisterPage;
