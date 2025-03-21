import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center",
        height: "84vh",
        position: 'relative',
        top: '-10vh',
      }}
    >
      <CircularProgress size={70} />
      <Typography variant="h4" style={{marginTop:10}}>Đang tải ...</Typography>
    </Box>
  );
};

export default Loading;
