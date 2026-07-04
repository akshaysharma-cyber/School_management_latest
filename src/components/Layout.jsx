import { Box } from "@mui/material";

export default function Layout({ sidebar, header, children }) {
  return (
    <Box sx={{ display: "flex" }}>
      {sidebar}

      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
        }}
      >
        {header}

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}