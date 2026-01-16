import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Indigo - Modern & Tech
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#EC4899', // Pink - Playful & Gamified
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444', // Red
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F1F5F9', // Slate 100 - Cool neutral
      paper: '#FFFFFF',
      subtle: '#E2E8F0',
    },
    text: {
      primary: '#1E293B', // Slate 800 - High contrast
      secondary: '#64748B', // Slate 500
      disabled: '#94A3B8',
    },
    action: {
      hover: 'rgba(99, 102, 241, 0.04)',
      selected: 'rgba(99, 102, 241, 0.08)',
    },
    divider: '#E2E8F0',
    gradient: {
      primary: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      secondary: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
      light: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
      fontSize: '2.5rem',
      '@media (min-width:600px)': { fontSize: '3.5rem' },
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      fontSize: '2rem',
      '@media (min-width:600px)': { fontSize: '2.5rem' },
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#1E293B',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1.1rem',
      color: '#64748B',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // 2
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // 3
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // 4
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // 5
    // ... extend standard shadows appropriately if usage requires
    ...Array(19).fill('none'), 
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F1F5F9', // Matches background.default
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F1F5F9',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#CBD5E1',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#94A3B8',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -2px rgba(99, 102, 241, 0.2)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: {
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease-in-out',
            '&.Mui-focused': {
               boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
            },
            '&:hover': {
               backgroundColor: '#F8FAFC',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        filled: {
          border: '1px solid transparent',
        },
        outlined: {
          borderWidth: '1.5px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: '#4F46E5',
            '&:hover': {
               backgroundColor: 'rgba(99, 102, 241, 0.15)',
            },
           '& .MuiListItemIcon-root': {
             color: '#4F46E5',
           },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
           border: '2px solid #FFFFFF',
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;

