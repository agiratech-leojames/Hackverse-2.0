import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Container, Badge, FormHelperText} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import metamask from '../../assets/MetaMask_Fox.png'
import NetworkConnection from '../../helpers/networkConnection';
import { useSelector } from 'react-redux';
import { getWalletData, walletStatus } from '../../redux/counter/counterSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom';

export default function BusinessRegistration() {
  
  const navigate = useNavigate();
  const isWalletConnected = useSelector(walletStatus);
  const { connectNetwork, logout } = NetworkConnection();
  const walletData = useSelector(getWalletData);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: isWalletConnected ? '#44b700' : '#D9434E',
      color: isWalletConnected ? '#44b700' : '#D9434E',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '&:hover::after': {
      content: `"${isWalletConnected ? 'Online' : 'Offline'}"`,
      color: 'white',
      backgroundColor: isWalletConnected ? 'green' : 'red',
      padding: '0.2rem 0.5rem',
      fontSize: '0.8rem',
      position: 'absolute',
      left: '150%',
      top: '100%',
      // right: '50%',
      transform: 'translate(-50%, -50%)',
      whiteSpace: 'nowrap',
      zIndex: 1,
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  const registrationValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }

  const registrationSchema = Yup.object().shape({
    firstName: Yup.string().required("Firstname is required"),
    lastName: Yup.string().required("Lastname is required"),
    businessname: Yup.string().required("Business Name is required"),
    email: Yup.string().email('Please enter valid email').required("Email is required"),
    password: Yup.string().required("Password is required")
  })

  // const handleSubmit = (values) => {
  //   console.log("Register data", values)
  // };
  const handleSubmitRegister = (values) => {
    if(walletData?.account){
    navigate('/businesslogin');
    console.log("Register data", values)
    }else{
    console.log("Wallet is not connected")
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          marginTop: '10rem',
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          {isWalletConnected ?
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar
                alt="Meta Mask"
                src={metamask}
                sx={{ width: 60, height: 60, cursor: 'pointer' }}
                onClick={logout}

              />
            </StyledBadge>
            :
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar
                alt="Meta Mask"
                src={metamask}
                sx={{ width: 60, height: 60, cursor: 'pointer' }}
                onClick={connectNetwork}

              />
            </StyledBadge>
          }

        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: '1rem',
          mb: '1rem'
        }}>
          <Typography component="h1" variant="h5">
            Business Registration
          </Typography>
        </Box>  

        <Formik
          initialValues={registrationValues}
          onSubmit={handleSubmitRegister}
          validationSchema={registrationSchema}
        >
          {(values) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                  <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                    <ErrorMessage name="firstName" />
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                  <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                    <ErrorMessage name="lastName" />
                  </FormHelperText>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="businessname"
                    label="Business Name"
                    name="businessname"
                    autoComplete="businessname"
                  />
                  <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                    <ErrorMessage name="businessname" />
                  </FormHelperText>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                  <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                    <ErrorMessage name="email" />
                  </FormHelperText>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                  <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                    <ErrorMessage name="password" />
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    disabled
                    value={isWalletConnected ? walletData?.account : ''}
                    name="walletAddress"
                    label="walletAddress"
                    type="walletAddress"
                    id="walletAddress"
                    variant="filled"
                    autoComplete="new-walletAddress"
                    sx={{
                      backgroundColor: '#D3D3D3'
                    }}
                  />
                  <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                    <ErrorMessage name="walletAddress" />
                  </FormHelperText>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, padding: '1rem' }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/businesslogin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              {/* </Box> */}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}