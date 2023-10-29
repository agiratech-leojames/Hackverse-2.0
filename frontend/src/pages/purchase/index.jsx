import { Box, Paper, Typography, Button, Input } from '@mui/material'
import React, { useState } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { walletStatus, getWalletData} from '../../redux/counter/counterSlice';
import NetworkConnection from '../../helpers/networkConnection';

const Purchase = () => {
  
  const [investment, setInvestment] = useState(0);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [accruedInterest, setAccruedInterest] = useState(0);
  const [maturityDate, setmaturityDate] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [riskLevel, setRiskLevel] = useState('low');
  const [businessID, setBusinessID] = useState(100);
  const currentTime = Date.now();
  console.log('currentTime :', currentTime);
  const {id} = useParams();

  const isWalletConnected = useSelector(walletStatus);
  const {connectNetwork} = NetworkConnection();
  const walletData = useSelector(getWalletData);

  
  const handleManualInvestmentChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setInvestment(value);
    }
  };

  const getweb3Data=()=>{
    
  }

  const submit = async(e) => {
    try{
      e.preventDefault();
      console.log("Purchase check data", "metamask", walletData?.account, investment, riskLevel, businessID);
    }catch(err){
      console.log(err, "purchase error");
    }
  }

  return (
    <Box>
      <Paper sx={{padding: '10px'}}>
      
        <Typography sx={{height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        variant='h4'
        >
        {id}  
        </Typography>

        <Typography variant='h5'>Invested Amount: {investedAmount}</Typography>
        <Typography variant='h5'>Interest Rate: {interestRate} </Typography>
        <Typography variant='h5'>Risk Level: {riskLevel} </Typography> 
        <Typography variant='h5'>Total earning: {accruedInterest}</Typography>
        <Typography variant='h5'>Maturity Period: 3 years</Typography>
        <Typography variant='h5'>Maturity Date: {maturityDate}</Typography>
        <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
          Add Investment:
          <Typography
            sx={{ display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              
              <Input sx={{padding:'5px'}}
              type="number"
              value={investment}
              onChange={handleManualInvestmentChange}
              inputProps={{min:0}}
              />

          </Typography>
        </Typography>
          
        <Typography sx={{height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding:'5px'}}>
          <Button variant='contained' onClick={submit}>Invest</Button>
          <Button variant='contained' sx={{marginLeft:'5px'}} disabled={maturityDate !== currentTime}> Withdraw Investment </Button>
        </Typography>

      </Paper>
    </Box>
  )
}

export default Purchase;