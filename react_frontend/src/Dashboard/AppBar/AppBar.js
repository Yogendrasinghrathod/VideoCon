import React from "react";
import { styled } from "@mui/system";
import DropdownMenu from "./DropdownMenu";
import ChosenOptionLabel from "./ChosenOptionLabel";
import { useTheme } from "@mui/material/styles";

const MainContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  right: "0",
  top: "0",
  height: "48px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: "transparent",
  width: "calc(100% - 326px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 15px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
}));

const AppBar = () => {
  const theme = useTheme();
  return (
    <MainContainer theme={theme}>
      <ChosenOptionLabel />
      <DropdownMenu />
    </MainContainer>
  );
};

export default AppBar;
