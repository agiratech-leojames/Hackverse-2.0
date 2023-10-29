import React,{useState} from "react";
import { Box, Typography, Paper, Input, Button} from "@mui/material";

export default function BusinessDashboard () {
  const [amountPerDue, setAmountPerDue] = useState(0);
  const [repayAmount, setRepayAmount] = useState(1000);
  const [interestPaid, setInterestPaid] = useState(0);
  const [interestBalance, setInterestBalance] = useState(0);
  const [interestRate, interest] = useState(0);
  const [collateralSet, setCollateralSet] = useState(0);
  const [fundToBeRaised, setFundToBeRaised] = useState(0);
  const [repayInput, setRepayInput] = useState(0);
  const [maturityDate, setMaturityDate] = useState(0);

  const currentTime = Date.now();
  console.log('currentTime: ', currentTime);

  const handleManualRepayChange=(event)=>{
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setRepayInput(value);
    }
  }

  return (
    <Box>
      <Paper sx={{padding: '10px'}}>
          <Typography variant='h3' sx={{marginLeft:'40%'}}>Your Portfolio</Typography>
          <Typography variant='h5'>Collateral Amount: {collateralSet} USDT </Typography>
          <Typography variant='h5'>Fund to be Raised: {fundToBeRaised} USDT </Typography>
          <Typography variant='h5'>Amount Per due: {amountPerDue} USDT</Typography>
          <Typography variant='h5'>Interest Rate: {interestRate} % </Typography>
          <Typography variant='h5'>Accrued Interest+Principal: {repayAmount} USDT</Typography>
          <Typography variant='h5'>Maturity Date: {maturityDate}</Typography>
          <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center' }}>
          Repay:
          <Typography
            sx={{ display: 'flex', alignItems: 'center', padding: '5px' }}
            >
              
              <Input sx={{padding:'5px'}}
              type="number"
              value={repayInput}  
              onChange={handleManualRepayChange}
              inputProps={{min:0, max: repayAmount}}
              />

          </Typography>
        </Typography>

        <Typography sx={{height: '10vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding:'5px'}}>
          <Button variant='contained'>Repay Amount</Button>
          <Button variant='contained' sx={{marginLeft:'5px'}} disabled={(maturityDate >= currentTime)&&(repayAmount===0)}> Withdraw Collateral </Button>
        </Typography>

        </Paper>
    </Box>  
  )

}