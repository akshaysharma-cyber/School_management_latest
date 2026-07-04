import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  IconButton,
  Typography,
  Box
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const drawerWidth = 260;

export default function Sidebar({ activePage, setActivePage }) {

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const drawer = (
    <Box>

      <Toolbar>
        <Typography fontWeight="bold">
          Alpine School
        </Typography>
      </Toolbar>

      <List>

        <ListItemButton
          selected={activePage==="dashboard"}
          onClick={()=>{
            setActivePage("dashboard");
            setOpen(false);
          }}
        >
          <ListItemText primary="Dashboard"/>
        </ListItemButton>

        <ListItemButton
          selected={activePage==="attendance"}
          onClick={()=>{
            setActivePage("attendance");
            setOpen(false);
          }}
        >
          <ListItemText primary="Attendance"/>
        </ListItemButton>

      </List>

    </Box>
  );

  return (
    <>

      {mobile && (

        <AppBar position="fixed">

          <Toolbar>

            <IconButton
              color="inherit"
              onClick={()=>setOpen(true)}
            >
              <MenuIcon/>
            </IconButton>

            <Typography sx={{ml:2,fontWeight:700}}>
              Alpine School
            </Typography>

          </Toolbar>

        </AppBar>

      )}

      <Drawer
        variant={mobile?"temporary":"permanent"}
        open={mobile?open:true}
        onClose={()=>setOpen(false)}
        ModalProps={{
          keepMounted:true
        }}
        sx={{
          width: drawerWidth,
          flexShrink:0,

          "& .MuiDrawer-paper":{
            width:drawerWidth,
            boxSizing:"border-box"
          }
        }}
      >
        {drawer}
      </Drawer>

    </>
  );
}