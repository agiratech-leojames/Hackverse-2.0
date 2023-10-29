import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import QueryStatsTwoToneIcon from '@mui/icons-material/QueryStatsTwoTone';
import Typography from '@mui/material/Typography';
import { Container, FormControl, FormHelperText, IconButton} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import metamask from '../../assets/MetaMask_Fox.png'


export default function Login() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // const [error, setError] = useState('');
  // const [logerror, setErrorlogin] = useState('');

  const loginValues = {
    userName: '',
    password: '',
  }
  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required")
  })

  const handleSubmit = (values) => {
    console.log("Submitted", values)
    navigate('/dashboard')
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: "10rem",
          display: 'flex',
          flexDirection: 'column',
          // alignContent: 'center',
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <Avatar
                alt="Meta Mask"
                src={metamask}
                sx={{ width: 60, height: 60, cursor: 'pointer' }}
                // onClick={logout}

              />
        <Typography component="h1" variant="h5" sx={{mt: '1rem'}}>
          Login
        </Typography>
        </Box>
        <Formik
          initialValues={loginValues}
          onSubmit={handleSubmit}
          validationSchema={loginSchema}
        >
          {(values) => (
            <Form>
              <Box onSubmit={handleSubmit} sx={{ mt: 1}}>
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
                <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                  <ErrorMessage name="email" />
                </FormHelperText>
                <Field
                  as={TextField}
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <FormHelperText sx={{ color: 'red', fontSize: '1rem' }}>
                  <ErrorMessage name="password" />
                </FormHelperText>                

                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href='/registration' variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid> 
                  <Link href='/businesslogin' variant="body2">
                      {"Business User click here"}
                  </Link>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>

  );
}