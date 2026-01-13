import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Rich blue - better contrast
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DC2626', // Strong red for accents
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#059669', // Emerald green
      light: '#10B981',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D97706', // Amber
      light: '#F59E0B',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626', // Red
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Light gray
      paper: '#FFFFFF',
      // Add dark surfaces for contrast
      dark: '#1F2937',
      accent: '#374151',
    },
    text: {
      primary: '#111827', // Very dark for maximum contrast
      secondary: '#374151', // Medium gray
      disabled: '#9CA3AF',
      // Add light text for dark surfaces
      light: '#F9FAFB',
      muted: '#6B7280',
    },
    divider: '#E5E7EB',
    // Enhanced color palette for mixed theme
    surface: {
      light: '#FFFFFF',
      medium: '#F3F4F6',
      dark: '#1F2937',
      darker: '#111827',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      secondary: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      success: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      dark: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
      light: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
      accent: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    // Custom colors for modern design
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#374151', // Better contrast than #6B7280
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#4B5563', // Improved contrast
    }
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0 40px 70px -15px rgba(0, 0, 0, 0.35)', // Shadow 8
    '0 45px 80px -18px rgba(0, 0, 0, 0.4)',  // Shadow 9
    '0 50px 90px -20px rgba(0, 0, 0, 0.45)', // Shadow 10
    '0 55px 100px -22px rgba(0, 0, 0, 0.5)', // Shadow 11
    '0 60px 110px -25px rgba(0, 0, 0, 0.55)', // Shadow 12
    '0 65px 120px -28px rgba(0, 0, 0, 0.6)', // Shadow 13
    '0 70px 130px -30px rgba(0, 0, 0, 0.65)', // Shadow 14
    '0 75px 140px -32px rgba(0, 0, 0, 0.7)', // Shadow 15
    '0 80px 150px -35px rgba(0, 0, 0, 0.75)', // Shadow 16
    '0 85px 160px -38px rgba(0, 0, 0, 0.8)', // Shadow 17
    '0 90px 170px -40px rgba(0, 0, 0, 0.85)', // Shadow 18
    '0 95px 180px -42px rgba(0, 0, 0, 0.9)', // Shadow 19
    '0 100px 190px -45px rgba(0, 0, 0, 0.95)', // Shadow 20
    '0 105px 200px -48px rgba(0, 0, 0, 1.0)', // Shadow 21
    '0 110px 210px -50px rgba(0, 0, 0, 1.0)', // Shadow 22
    '0 115px 220px -52px rgba(0, 0, 0, 1.0)', // Shadow 23
    '0 120px 230px -55px rgba(0, 0, 0, 1.0)', // Shadow 24
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          height: '100%',
          scrollBehavior: 'smooth',
        },
        body: {
          height: '100%',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)',
          backgroundAttachment: 'fixed',
          color: '#1F2937',
        },
        '#root': {
          height: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '@media (max-width:600px)': {
            padding: '12px 20px',
            fontSize: '0.875rem',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2.5), // Default padding
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
          backgroundImage: 'none', // Merged from the second MuiPaper
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(3.5), // Larger padding on small screens and up
          },
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(5), // Even larger padding on medium screens and up
          },
        }),
        elevation1: { // Kept as a separate style for elevation1
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          '@media (max-width:600px)': {
            borderRadius: 12,
            margin: '8px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E5E7EB',
          color: '#111827', // Darker text for better contrast
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid #E5E7EB',
          color: '#111827', // Better contrast
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          padding: '12px 16px',
          transition: 'all 0.2s ease-in-out',
          color: '#374151', // Better text contrast
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            transform: 'translateX(4px)',
            color: '#111827', // Darker on hover
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.16)',
            color: '#111827',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.20)',
              color: '#111827',
            },
          },
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
            '& .MuiOutlinedInput-input': {
              color: '#111827', // Better input text contrast
            },
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#4B5563', // Better label contrast
            '&.Mui-focused': {
              color: '#6366F1',
            },
          },
          '& .MuiFormHelperText-root': {
            color: '#6B7280',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600, // Increased weight for better readability
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        colorPrimary: {
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#4F46E5',
          },
        },
        colorSecondary: {
          backgroundColor: '#EC4899',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#DB2777',
          },
        },
        colorSuccess: {
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
        colorWarning: {
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#D97706',
          },
        },
        colorError: {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#DC2626',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: '#E5E7EB',
        },
        bar: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6366F1 0%, #8B8CF8 100%)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit', // Will use theme text colors
        },
        body2: {
          color: '#374151', // Better contrast for body2 text
        },
        caption: {
          color: '#4B5563', // Better contrast for caption text
        },
        subtitle2: {
          color: '#374151', // Better contrast
        },
        h6: {
          color: '#111827', // Darker headings
        },
        h5: {
          color: '#111827',
        },
        h4: {
          color: '#111827',
        },
        h3: {
          color: '#111827',
        },
        h2: {
          color: '#111827',
        },
        h1: {
          color: '#111827',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          color: '#4B5563', // Better contrast for tabs
          '&.Mui-selected': {
            color: '#6366F1', // Primary color for selected tab
            fontWeight: 600,
          },
          '@media (max-width:600px)': {
            minHeight: 40,
            fontSize: '0.8rem',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#6366F1',
          color: '#FFFFFF',
          fontWeight: 600,
        },
        colorSecondary: {
          backgroundColor: '#EC4899',
          color: '#FFFFFF',
          fontWeight: 600,
        },
        colorError: {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 600,
        },
        colorWarning: {
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
          fontWeight: 600,
        },
        colorSuccess: {
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
        },
      },
    },
  },
  // Custom theme extensions for animations
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default theme;