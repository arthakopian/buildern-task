import * as React from 'react';
import {
  Box,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { createTheme, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import SubjectIcon from '@mui/icons-material/Subject';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'teachers',
    title: 'Teachers',
    icon: <PeopleAltIcon />,
  },
  {
    segment: 'pupils',
    title: 'Pupils',
    icon: <SchoolIcon />,
  },
  {
    segment: 'subjects',
    title: 'Subjects',
    icon: <SubjectIcon />,
  },
];

// Custom theme for the dashboard
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960, // Adjusted to standard MUI breakpoint
      lg: 1200,
      xl: 1536,
    },
  },
});

// Component for rendering page content based on the active path
function PageContent() {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Outlet />
    </Box>
  );
}


// ToolbarActions component including search and logout
function ToolbarActions() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <React.Fragment>
      <Tooltip title="Logout" enterDelay={1000}>
        <IconButton
          type="button"
          aria-label="logout"
          onClick={handleLogout}
          sx={{ ml: 1 }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

// Main layout component with toolbar and navigation
function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  useAuth()
  React.useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const handleNavigation = (segment) => navigate(`/dashboard${segment}`)
  const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: handleNavigation
  };

  return (
    <AppProvider
      branding={{ title: 'School Management Tool' }}
      navigation={NAVIGATION}
      theme={demoTheme}
      router={router}
    >
      <DashboardLayout slots={{ toolbarActions: ToolbarActions }}>
        <PageContent pathname={location.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Dashboard;
