import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Add,
  Build,
  ArrowForward
} from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Paper,
  Button,
  Container,
  Typography,
  CardActions,
  CardContent
} from '@mui/material';

import { ADULT_DAYCARE_PATHS } from '../../routes/paths';

const dashboardCards = [
  {
    title: 'Custom Form Builder',
    description: 'Create dynamic forms for clients, caregivers, and coordinators',
    icon: Build,
    color: 'primary.main',
    path: ADULT_DAYCARE_PATHS.customForm
  }
];

export default function AdultDaycareDashboard() {
  const navigate = useNavigate();
  const [recentForms] = useState([
    { name: 'Client Assessment Form', lastModified: '2024-01-15', type: 'Assessment' },
  ]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        Custom Form Builder Dashboard
      </Typography>
      
      {/* Main Dashboard Cards */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Form Builder Tools
        </Typography>
        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                }}
                onClick={() => handleCardClick(card.path)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <card.icon sx={{ fontSize: 50, color: card.color, mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button 
                    variant="outlined" 
                    endIcon={<ArrowForward />}
                    onClick={() => handleCardClick(card.path)}
                  >
                    Access
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Recent Forms */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Recent Forms
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleCardClick(ADULT_DAYCARE_PATHS.customForm)}
          >
            Create New Form
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          {recentForms.map((form, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {form.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Type: {form.type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last modified: {form.lastModified}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
} 