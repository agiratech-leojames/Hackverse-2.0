import React, { useEffect, useState} from 'react';
import Web3 from 'web3';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, styled, MobileStepper, StepLabel, StepContent, Stepper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import nft from '../../assets/nft3.webp'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import { getBorrowersAddress, readBorrowerLoanDetails } from '../../integration/web3Client';
import { getBorrowersDetails } from '../../integration/web3Client';

const Dashboard = () => {
  
  const [loanBorrowers, setLoanBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loanBorrowersFromContract = await getBorrowersAddress("metamask");
        setLoanBorrowers(loanBorrowersFromContract);
        console.log('LoanBorrowers dashboard', loanBorrowers);
  
        const detailsPromises = loanBorrowers.map(async (borrowerAddress, index) => {
          const details = await getBorrowersDetails("metamask", borrowerAddress);
          console.log('details', details);
  
          const businessID = 101 + index;
          console.log('businessID: ', businessID);
          const loanDetails = await readBorrowerLoanDetails("metamask", borrowerAddress, businessID);
          console.log('loandetails dashboard:', loanDetails);
          return {
            address: borrowerAddress,
            details,
            loanDetails,
          };
        });
  
        const loanBorrowersWithDetails = await Promise.all(detailsPromises);
        console.log('LoanBorrowers with Details dashboard', loanBorrowersWithDetails);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
  
    fetchData();
  }, []);
  
  
  // Sample data (replace with your actual data)


  const tokenData = [
    { name: 'GoldBes', price: 10000, fundsofar: 2000},
    {name: 'ADFC Bank', price: 20000, fundsofar: 2000},
    { name: 'NMDC', price: 50000, fundsofar: 2000 },
    {name:'Zapto Deliveries', price: 80000,fundsofar: 2000},
    {name: 'Zindal Steel', price: 40000,fundsofar: 2000},
    {name: 'Bharat Handicrafts', price:30000,fundsofar: 2000}
  ];

  const steps = [ 
    {
      label: 'Low',
      description: ' Check the details of a bond before purchase. We have labelled certain companies as low risk as they give you guaranteed returns compared to others. Due to this safety, the interest you earn from these Bonds are less. In our platform it is 5%',
    },
    {
      label: 'Medium',
      description: ' These are not as safe as Low Risk companies. But still these companies rarely face loss and hence they are medium risk. You can earn a 10% interest by investing in these bonds ',
    },
    {
      label: 'High',
      description: 'Only investors with good knowledge about these companies can take this risk. We have marked these as high based on our analysis. Due to the risk you take the interest you earn is high. Earn a 20% of interest by investing in these companies.',
    }
    
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  const StyledLink = styled('a')({
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
      textDecoration: 'underline',
    },
  });

  const navigate = useNavigate()
  const theme = useTheme();

  const handleBuy = (value) => {
    console.log("Details to Buy ");
    navigate(`/purchase/${value}`);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', mt: '2rem' }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 'bolder',
          border: '0.5rem solid #D3D3D3',
          width: '80%',
          textAlign: 'center',
          padding: '2rem 0'
        }}>
        AVAILABLE NFT BONDS
      </Typography>

      <TableContainer sx={{ maxHeight: 460, width: '80%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow >
              <TableCell sx={{ bgcolor: '#051F3F', color: 'white', width: '35%', textAlign: 'center' }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bolder',
                  }} >
                  NFT Bond
                </Typography>
              </TableCell>
              <TableCell sx={{ bgcolor: '#051F3F', color: 'white', width: '35%', textAlign: 'center' }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bolder',
                  }}>
                  Total Fund to be Raised
                </Typography>
              </TableCell>

              <TableCell sx={{ bgcolor: '#051F3F', color: 'white', width: '35%', textAlign: 'center' }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bolder',
                  }}>
                  Fund Raised
                </Typography>
              </TableCell>
              
              <TableCell sx={{ bgcolor: '#051F3F', color: 'white', width: '20%', textAlign: 'center' }}>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bolder',
                  }}>
                  Details
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokenData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ bgcolor: '#D3D3D3', width: '35%', height: '5vh', textAlign: 'center' }}>
                  <Typography
                    variant='button'
                    sx={{ fontWeight: 'bold' }}
                  >
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ bgcolor: '#D3D3D3', width: '35%', textAlign: 'center' }}>
                  <Typography
                    variant='button'
                    sx={{ fontWeight: 'bold' }}
                  >
                   {row.price} USDT
                  </Typography>
                </TableCell>

                <TableCell sx={{ bgcolor: '#D3D3D3', width: '35%', textAlign: 'center' }}>
                  <Typography
                    variant='button'
                    sx={{ fontWeight: 'bold' }}
                  >
                   {row.fundsofar} USDT
                  </Typography>
                </TableCell>

                <TableCell sx={{ bgcolor: '#D3D3D3', width: '20%', textAlign: 'center' }}>
                  <Button
                    variant='contained'
                    sx={{ fontWeight: 'bold' }}
                    onClick={()=>{handleBuy(row.name)}}
                  >Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant='h4'
        sx={{
          fontWeight: 'bolder',
          width: '80%',
          textAlign: 'center',
          mt: '6rem'
          // padding: '2rem 0'
        }}>
        About Bonds and their Risk Levels
      </Typography>

      <Box sx={{
        // padding: '2rem', 
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        mt: '6rem',
        // height: '50vh'
      }}>
        <img
          src={nft}
          style={{
            height: "20vh",
            width: '50%',
            objectFit: "contain",
          }}
        />

        <Box sx={{ width: '50%', flexGrow: 1, bgcolor: '#D3D3D3', }}>
          <Paper
            square
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 50,
              pl: 2,
              bgcolor: 'black',
              color: 'white'
            }}
          >
            <Typography variant='button' sx={{fontWeight: 'bold'}}>{steps[activeStep].label}</Typography>
          </Paper>
          <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}>
            <Typography variant='button'>{steps[activeStep].description}</Typography>
          </Box>
          <MobileStepper
          sx={{ bgcolor: 'black'}}
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                sx={{
                  color: 'white'
                }}
                disabled={activeStep === maxSteps - 1}
              >
                Next
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Box>
      </Box>

      <Box sx={{ width: '100%', bgcolor: '#001f3f', marginTop: '6rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', padding: '2rem 0 2rem', height: '20vh' }}>
          <Box sx={{ minHeight: '100px' }}>
            <Typography variant="body2" sx={{ color: 'grey', marginBottom: '1rem' }}>
              ABOUT
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              <StyledLink href="/contact">Contact Us</StyledLink><br />
              <StyledLink href="/about">About Us</StyledLink><br />
              <StyledLink href="/infringement">Report Infringement</StyledLink>
            </Typography>

          </Box>


          <Box sx={{ minHeight: '100px' }}>
            <Typography variant="body2" sx={{ color: 'grey', marginBottom: '1rem' }}>
              HELP
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              <StyledLink href="/payments">Payments</StyledLink><br />
              <StyledLink href="/shipping">Token details</StyledLink><br />
              <StyledLink href="/returns">Prive list</StyledLink><br />
              <StyledLink href="/faq">FAQ</StyledLink><br />
            </Typography>
          </Box>

          <Box >
            <Typography variant="body2" sx={{ color: 'grey', marginBottom: '1rem' }}>
              Mail Us:
            </Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Shop Smartly<br />
              Ground Floor, O Square, 36/2B,<br />
              Mount Poonamallee Rd, Parangi Malai,<br />
              Chennai, Tamil Nadu 600016
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'grey', marginBottom: '1rem' }}>
              Registered Office Address:
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', marginTop: '1rem' }}>
              Shop Smartly,<br />
              1604 US-130,<br />
              North Brunswick Township,<br />
              NJ 08902, USA
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', marginTop: '1rem' }}>
              CIN : U51109KA2012PTC066107
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', marginTop: '1rem' }}>
              Telephone: 044-45614700
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
