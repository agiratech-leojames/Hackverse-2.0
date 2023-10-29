//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Registration.sol";

contract Escrow{

    address public registrationContractAddress;
    IERC20 public usdcAddress;

    // Events:
    event investedByFundProvider(address indexed _fundProvider,uint indexed _tokens, uint indexed _success);    

    string private l = "low";
    string private m = "medium";
    string private h = "high";

    // uint public interestForLowRisk = 2;
    // uint public interestForMediumRisk = 5;
    // uint public interestForHighRisk = 10;
    uint private identificationNumber;
    uint constant private Status_Success = 200;
    uint public taxedTokens;
    uint public tokensInPool;
    uint public collateralPercentage = 30;
    uint public interestPercForBorrowerWhileRetuning = 11;

    

    constructor(address _registrationContract, address _usdcAddress){
        registrationContractAddress = _registrationContract;
        usdcAddress = IERC20(_usdcAddress);
        identificationNumber = 100;
        interestGenerator[l] = 5;
        interestGenerator[m] = 10;
        interestGenerator[h] = 20;
    }

     // STRUCT
    struct LoanProviderRecord {
        address _loanProviderAddress;
        uint _identityNumber;
        uint _duration;
        uint _amountInvested;
        uint _interestPercentage;
        uint _collectedTax;
        uint _actualAmountInvested;
        string _selectedBond;
        uint _speculatingInterestAndPrincipal;
    }

    struct LoanBorrower{
        uint _askingAmount;
        string _businessName;
        uint _collateralAmountInvested;
        uint identificationNumber;
        uint taxDeducted;
        string riskStatus;
        uint _dueTimes;
        uint _duePerInstallment;
        uint _totalAmountWithInterest;
        bool _status;
        uint _maturityDate;
    }

    // MAPPINGS:
    mapping(string => uint) private interestGenerator;
    mapping(address => mapping(uint => bool)) private isIdForInvestor;
    mapping(address => mapping(uint => LoanProviderRecord)) private loanProviderDetails;
    mapping(address => uint[]) private allIdentificationAssociatedWithLoanProviderAddress;
    mapping(address => mapping(uint => uint)) public finalBalance; 
    mapping(address => mapping(uint => LoanBorrower)) private loanBorrowerDetails;
    mapping(address => mapping(string => uint)) public borrowerIdentityNumber;
    mapping(address => mapping(string => string)) public businessRisk;
    mapping(address => mapping(uint => uint)) public remainingBalanceForBorrower;
    mapping(address => mapping(uint => bool)) public statusOfBorrower;
    mapping(uint => uint) private totalAmountInvestedInIdentity;

    // Events:
    event DepositedByBorrower(address indexed _ad, uint indexed _identificationNumber);

    function depositTreasury(uint _amount) external {
        require(IERC20(usdcAddress).transferFrom(msg.sender, address(this), _amount), "transaction failed or reverted");
        tokensInPool += _amount;
    }
     
  
    function depositByBorrower(uint _askingMoney, string memory _businessName, string memory _risk, uint _dueNos, uint _matureDate)external {
        Registration registration = Registration(registrationContractAddress);
        require(registration.isLoanBorrowerRegistered(msg.sender), "The loan borrower address is not registered yet");
        // identification number generation:
        identificationNumber = identificationNumber + 1;
        // collateral seperation:
        uint amount = _askingMoney * collateralPercentage / 100;
        uint taxedTok = amount * 1 / 100;
        taxedTokens += taxedTok;
        uint finalAmount = amount - taxedTok;
        uint totalAmount = _askingMoney - taxedTok;
        // store data:
        loanBorrowerDetails[msg.sender][identificationNumber]._askingAmount = _askingMoney;
        loanBorrowerDetails[msg.sender][identificationNumber]._businessName = _businessName;
        loanBorrowerDetails[msg.sender][identificationNumber]._collateralAmountInvested = finalAmount;
        loanBorrowerDetails[msg.sender][identificationNumber].identificationNumber = identificationNumber;
        loanBorrowerDetails[msg.sender][identificationNumber].riskStatus = _risk;
        loanBorrowerDetails[msg.sender][identificationNumber].taxDeducted = taxedTok;
        loanBorrowerDetails[msg.sender][identificationNumber]._dueTimes = _dueNos;
        uint calcInterest = totalAmount * interestPercForBorrowerWhileRetuning / 100;
        uint interestPlusPrincipal = _askingMoney + calcInterest;
        uint duePerIns = interestPlusPrincipal / _dueNos;
        loanBorrowerDetails[msg.sender][identificationNumber]._duePerInstallment = duePerIns;
        // uint calculateDueEveryTime = calcInterest * _dueNos;
        loanBorrowerDetails[msg.sender][identificationNumber]._totalAmountWithInterest = interestPlusPrincipal;
        loanBorrowerDetails[msg.sender][identificationNumber]._maturityDate = _matureDate;
        // identityNumber
        borrowerIdentityNumber[msg.sender][_businessName] = identificationNumber;
        businessRisk[msg.sender][_businessName] = _risk;
        remainingBalanceForBorrower[msg.sender][identificationNumber] = loanBorrowerDetails[msg.sender][identificationNumber]._totalAmountWithInterest;
        require(IERC20(usdcAddress).transferFrom(msg.sender, address(this), finalAmount), "transaction failed or reverted");
        emit DepositedByBorrower(msg.sender, identificationNumber);
    }

    
    function claimTokenFromFundProvider(uint _identificationNumber, address _fundProvider) external{
        Registration registration = Registration(registrationContractAddress);
        require(registration.isLoanBorrowerRegistered(msg.sender), "The loan borrower address is not registered yet");
        require(isIdForInvestor[_fundProvider][_identificationNumber],"dues are paid");
        uint fullAmount = loanProviderDetails[_fundProvider][_identificationNumber]._actualAmountInvested;
        require(IERC20(usdcAddress).transfer(msg.sender, fullAmount), "transaction failed or reverted");
    }

    // REPAY LOAN
    function repayBorrowedLoan(uint _identificationNumber) external {
        // require(loanBorrowerDetails[msg.sender][_identificationNumber]._status, "All dues are paid");
        Registration registration = Registration(registrationContractAddress);
        require(registration.isLoanBorrowerRegistered(msg.sender), "The loan borrower address is not registered yet");
        if(remainingBalanceForBorrower[msg.sender][_identificationNumber] <= 0){
            revert("All dues are paid");
        }
        if(remainingBalanceForBorrower[msg.sender][_identificationNumber] > 0){
            uint dueAmount = loanBorrowerDetails[msg.sender][_identificationNumber]._duePerInstallment;
            require(IERC20(usdcAddress).transferFrom(msg.sender, address(this), dueAmount), "transaction failed or reverted");
            loanBorrowerDetails[msg.sender][_identificationNumber]._totalAmountWithInterest -= dueAmount;
            remainingBalanceForBorrower[msg.sender][_identificationNumber] -= dueAmount;
        }
    }

    function withdrawCollateralByBorrower(uint _identificationNumber) external{
        if(remainingBalanceForBorrower[msg.sender][_identificationNumber] <= 0){
           uint collateralAmount = loanBorrowerDetails[msg.sender][_identificationNumber]._collateralAmountInvested; 
           require(IERC20(usdcAddress).transferFrom(msg.sender, address(this), collateralAmount), "transaction failed or reverted"); 
        }
    }

    function depositCollateralToFundProvider(address _borrower, uint _identificationNumber) external{
        Registration registration = Registration(registrationContractAddress);
        require(registration.isLoanProviderRegistered(msg.sender), "The loan provider address is not registered yet");
        require(isIdForInvestor[msg.sender][_identificationNumber], "Identification is not linked yet with fund provider");
        // send the total balance
        require(remainingBalanceForBorrower[_borrower][_identificationNumber] <= 0, "Cannot withdraw collateral");
        uint collateralAmount = loanBorrowerDetails[msg.sender][_identificationNumber]._collateralAmountInvested; 
        require(IERC20(usdcAddress).transferFrom(address(this), msg.sender, collateralAmount), "transaction failed or reverted"); 
    }

    /**
        * @notice - FUNCTION NAME : depositFundByLoanProvider
        * @param _amount - Invested token amount
        * @param _bondType - Enter either low, medium or high
    */
    function depositByFundProvider(uint _amount, string memory _bondType, uint _identificationNumber) external {
        // registration verification:
        Registration registration = Registration(registrationContractAddress);
        require(registration.isLoanProviderRegistered(msg.sender), "The loan provider address is not registered yet");
        // identification number allocation:
        
        isIdForInvestor[msg.sender][_identificationNumber] = true;        
        // allocate the details to struct:
        loanProviderDetails[msg.sender][_identificationNumber]._loanProviderAddress = msg.sender;
        loanProviderDetails[msg.sender][_identificationNumber]._identityNumber = _identificationNumber;
        loanProviderDetails[msg.sender][_identificationNumber]._duration = block.timestamp + 3 minutes;
        loanProviderDetails[msg.sender][_identificationNumber]._amountInvested = _amount;
        loanProviderDetails[msg.sender][_identificationNumber]._interestPercentage = interestGenerator[_bondType];
        loanProviderDetails[msg.sender][_identificationNumber]._collectedTax = (loanProviderDetails[msg.sender][_identificationNumber]._amountInvested * 1) / 100;
        // tax
        taxedTokens += loanProviderDetails[msg.sender][_identificationNumber]._collectedTax;
        loanProviderDetails[msg.sender][_identificationNumber]._selectedBond = _bondType;
        loanProviderDetails[msg.sender][_identificationNumber]._actualAmountInvested = loanProviderDetails[msg.sender][_identificationNumber]._amountInvested - loanProviderDetails[msg.sender][_identificationNumber]._collectedTax;
        totalAmountInvestedInIdentity[_identificationNumber] += loanProviderDetails[msg.sender][_identificationNumber]._actualAmountInvested;
        // actual tokens
        tokensInPool += loanProviderDetails[msg.sender][_identificationNumber]._actualAmountInvested;
        uint calculatedInterest = (loanProviderDetails[msg.sender][_identificationNumber]._actualAmountInvested * loanProviderDetails[msg.sender][_identificationNumber]._interestPercentage) / 100;
        loanProviderDetails[msg.sender][_identificationNumber]._speculatingInterestAndPrincipal = loanProviderDetails[msg.sender][_identificationNumber]._actualAmountInvested + calculatedInterest;
        finalBalance[msg.sender][_identificationNumber] = loanProviderDetails[msg.sender][_identificationNumber]._actualAmountInvested + calculatedInterest;
        // store ids:
        allIdentificationAssociatedWithLoanProviderAddress[msg.sender].push(_identificationNumber);
        // get tokens:
        require(IERC20(usdcAddress).transferFrom(msg.sender, address(this), _amount), "transaction failed or reverted");
        emit investedByFundProvider(msg.sender, _amount, Status_Success);
    }

    
    function releasePaymentToFundProvider(uint _identificationNumber) external {
        require(isIdForInvestor[msg.sender][_identificationNumber], "Already withdrawn");
        // Check if time has exceeded
        require(block.timestamp >= loanProviderDetails[msg.sender][_identificationNumber]._duration, "Time has not exceeded yet");

        // Ensure the contract has enough balance
        uint amount = finalBalance[msg.sender][_identificationNumber];

        // Transfer tokens
        require(IERC20(usdcAddress).transfer(msg.sender, amount), "Token transfer failed or reverted");
        tokensInPool -= amount;
        // changing it to false.
        isIdForInvestor[msg.sender][_identificationNumber] = false;
    }

    function enquiryFundDetailsFundProvider(address _user, uint _identificationNumber) external view returns(LoanProviderRecord memory details){
        return loanProviderDetails[_user][_identificationNumber];
    }

    function getContractBalance() external view returns (uint256) {
        return usdcAddress.balanceOf(address(this));
    }


    /**
     * READ FUNCTION
     */
    function readDashboardBorrower(address _borrower, uint _identificationNumber) external view returns(
        string memory businessName,
        uint askingTokenValue,
        uint totalAmountInvestedForThisIndentity){
            return(
                loanBorrowerDetails[_borrower][_identificationNumber]._businessName,
                loanBorrowerDetails[_borrower][_identificationNumber]._askingAmount,
                totalAmountInvestedInIdentity[_identificationNumber]
            );
    }

    /**
     * READ FUNCTION:
     */
    function readDetailsPageFundProvider(address _fundProvider, uint _identificationNumber) external view returns(
        uint investedAmount,
        uint interestRate,
        string memory riskLevel,
        uint principalAndInterest,
        uint maturityDate
    ){
        return(
            loanProviderDetails[_fundProvider][_identificationNumber]._amountInvested,
            loanProviderDetails[_fundProvider][_identificationNumber]._interestPercentage,
            loanProviderDetails[_fundProvider][_identificationNumber]._selectedBond,
            loanProviderDetails[_fundProvider][_identificationNumber]._speculatingInterestAndPrincipal,
            loanProviderDetails[_fundProvider][_identificationNumber]._duration
        );
    }

    /**
     * READ FUNCTION:
     */
    function readDetailsForBorrower(address _borrower, uint _identificationNumber) external view returns(
        uint collateralAmt,
        uint fundToBeRaised,
        uint interestRate,
        uint perDueAmount,
        uint principalAndInterestToPay,
        uint maturityDate
    ){
        return(
            loanBorrowerDetails[_borrower][_identificationNumber]._collateralAmountInvested,
            loanBorrowerDetails[_borrower][_identificationNumber]._askingAmount,
            interestPercForBorrowerWhileRetuning,
            loanBorrowerDetails[_borrower][_identificationNumber]._duePerInstallment,
            loanBorrowerDetails[_borrower][_identificationNumber]._totalAmountWithInterest,
            loanBorrowerDetails[_borrower][_identificationNumber]._maturityDate
        );
    }
}