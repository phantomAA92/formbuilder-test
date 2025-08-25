import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import {
  Home,
  Build,
  Close,
  Dashboard,
  ExpandLess,
  ExpandMore,
  AccountCircle,
  Notifications
} from '@mui/icons-material';
import {
  Box,
  List,
  Drawer,
  ListItem,
  Collapse,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItemSecondaryAction
} from '@mui/material';

import { ADULT_DAYCARE_PATHS } from '../../routes/paths';

const drawerWidth = 280;

const menuItems = [
  {
    title: 'Dashboard',
    icon: Dashboard,
    path: '/',
    badge: null
  },
  {
    title: 'Custom Form Builder',
    icon: Build,
    path: ADULT_DAYCARE_PATHS.customForm,
    badge: null,
    description: 'Create dynamic forms'
  },
];

export default function AdultDaycareSidebar({ open, onClose, variant }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleItemClick = (path) => {
    if (path) {
      navigate(path);
      if (variant === 'temporary') {
        onClose();
      }
    }
  };

  const handleExpandClick = (title) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.title);
    const isItemActive = isActive(item.path);

    return (
      <Box key={item.title}>
        <ListItem
          disablePadding
          sx={{
            pl: level * 2 + 2,
            '& .MuiListItemButton-root': {
              borderRadius: 1,
              mx: 1,
              mb: 0.5
            }
          }}
        >
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleExpandClick(item.title);
              } else {
                handleItemClick(item.path);
              }
            }}
            selected={isItemActive}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.main'
                }
              },
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              secondary={item.description}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: isItemActive ? 600 : 400
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: 'inherit'
              }}
            />
            {hasChildren && (
              <ListItemSecondaryAction>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemSecondaryAction>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem
                  key={child.title}
                  disablePadding
                  sx={{ pl: (level + 1) * 2 + 2 }}
                >
                  <ListItemButton
                    onClick={() => handleItemClick(child.path)}
                    selected={isActive(child.path)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.main'
                        }
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5
                    }}
                  >
                    <ListItemText
                      primary={child.title}
                      secondary={child.description}
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: isActive(child.path) ? 600 : 400
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.7rem',
                        color: 'inherit'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Home color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Adult Daycare
            </Typography>
          </Box>
          {variant === 'temporary' && (
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Management System
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List component="nav" sx={{ px: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AccountCircle color="action" />
          <Typography variant="body2" color="text.secondary">
            Admin User
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications color="action" />
          <Typography variant="caption" color="text.secondary">
            No new notifications
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (variant === 'permanent') {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
} 