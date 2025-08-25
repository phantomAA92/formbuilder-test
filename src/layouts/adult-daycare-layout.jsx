import { useState } from 'react';

import { Menu, Dashboard } from '@mui/icons-material';
import {
  Box,
  AppBar,
  Toolbar,
  useTheme,
  IconButton,
  Typography,
  useMediaQuery
} from '@mui/material';

import AdultDaycareSidebar from '../components/sidebar/adult-daycare-sidebar';

export default function AdultDaycareLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {isMobile ? (
        <AdultDaycareSidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          variant="temporary"
        />
      ) : (
        <AdultDaycareSidebar variant="permanent" />
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={1}
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <Menu />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Dashboard color="primary" />
              <Typography variant="h6" component="div">
                Adult Daycare Management System
              </Typography>
            </Box>

            {/* Add any additional toolbar items here */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* You can add notifications, user menu, etc. here */}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
            p: { xs: 2, md: 3 }
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
} 