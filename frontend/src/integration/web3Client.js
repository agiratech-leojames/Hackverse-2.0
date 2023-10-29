import Web3 from 'web3';
import registerABI from './abi/registration/registrationabi.json';
import escrowABI from './abi/escrow/escrowabi.json';

let isRegisterInitialized = false;
let registerContract;

let isescrowInitialized = false;
let escrowContract;

export const detectCurrentProvider = (conn_provider = 'metamask') => {
  let provider;
  if (window.ethereum) {
    provider = window.ethereum;
  }
  if (provider &&
    provider.providers &&
    provider.providers.length &&
    conn_provider === 'metamask') {
    let m_provider = window.ethereum.providers.find((x) => x.isMetaMask);
    if (m_provider) provider = m_provider;
  }
  return provider;
};

// main: initiate the metamask wallet (used it in header part)
export const initiateNetwork = async (provider) => {
  try {
    const currentProvider = detectCurrentProvider(provider);
    if (currentProvider) {
      await currentProvider.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(currentProvider);
      const userAccount = await web3.eth.getAccounts();
      const chainId = await web3.eth.getChainId();
      const networkId = await web3.eth.net.getId();

      if (userAccount.length === 0) {
        return new Error('Please connect to Metamask');
      } else {
        const account = userAccount[0];
        let balance = await web3.eth.getBalance(account); // Get wallet balance
        balance = web3.utils.fromWei(balance, 'ether'); //Convert balance to wei

        return { balance, account, chainId, networkId };
      }
    } else return new Error('Non-Ethereum browser detected. You should consider trying Metamask')
  } catch (err) {
    console.log(err);
    return new Error(
      'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
    );
  }
}

// initiate UserLandRegistration Contract:

// export const initiateRegisterContract = async (conn_provider) => {
//   let provider = detectCurrentProvider(conn_provider)

//   if (provider) {
//     const web3 = new Web3(provider);
//     registerContract = new web3.eth.Contract(
//       UserLandRegistration,
//       process.env.REACT_APP_REGISTER_CONTRACT
//       // "0x5F979172c3c55698Fc181d939568C618C61D5793"
//     );
//       // console.log("Address", process.env.REACT_APP_REGISTER_CONTRACT)
//       isRegisterInitialized = true;
//   }
// }

// WRITE FUNCTIONS:

//INITIATE USER REGISTRATION CONTRACT:

export const initiateRegisterContract = async (conn_provider)=>{
  let provider = detectCurrentProvider(conn_provider);

  if(provider){
    const web3 = new Web3(provider);
    registerContract = new web3.eth.Contract(
      registerABI,
      process.env.REACT_APP_REGISTRATION_CONTRACT
    );

    isRegisterInitialized = true;
  }
}

export const initiateEscrowContract = async (conn_provider) => {
  let provider = detectCurrentProvider(conn_provider);

  if(provider){
    const web3 = new Web3(provider);
    escrowContract = new web3.eth.Contract(
      escrowABI,
      process.env.REACT_APP_ESCROW_CONTRACT
    );
    isescrowInitialized = true;
  }

  
}

// Read functions Registration Contract:
export const getBorrowersAddress = async(conn_provider)=>{
  console.log('Getting all borrowers address');
  if(!isRegisterInitialized){
    await initiateRegisterContract(conn_provider);
  }

  return await registerContract.methods.getAllLoanBorrowersAddress()
    .call()
    .then((allLoanBorrowers)=>{
      console.log(allLoanBorrowers);
      return allLoanBorrowers;
    })
}

export const getBorrowersDetails = async(conn_provider, walletAddress) =>{
  console.log('Getting borrowers details');
  if(!isRegisterInitialized){
    await initiateRegisterContract(conn_provider);
  }

  return await registerContract.methods.returnLoanBorrowerDetails(walletAddress)
    .call()
    .then((loanBorrowerDetails)=>{
      console.log('LoanBorrowerDetails:', loanBorrowerDetails);
      return loanBorrowerDetails;
    })
}


// Write functions Registration Contract:

// Read functions escrow contract:

export const readBorrowerLoanDetails = async(conn_provider, walletAddress, businessID)=>{
  console.log('Getting borrower loan details');
  if(!isescrowInitialized) {
    await initiateEscrowContract(conn_provider)
  }

  return await escrowContract.methods.readDetailsForBorrower(walletAddress, businessID)
    .call()
    .then((loanDetailsForBorrower)=>{
      console.log('LoanDetailsForBorrower:',loanDetailsForBorrower);
      return loanDetailsForBorrower;
    })
  
}

// write functions escrow contract:

export const invest = async(conn_provider, w_address, amount, bondtype, identificationNumber) => {
  let provider = detectCurrentProvider(conn_provider);
  
  if(!isescrowInitialized) {
    await initiateEscrowContract(conn_provider)
  }

  if(provider){
    return await escrowContract.methods.depositByFundProvider(amount, bondtype,identificationNumber).send({
      from: w_address
    })

  }
}
