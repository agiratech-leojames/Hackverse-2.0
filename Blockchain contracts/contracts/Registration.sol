//SPDX-License-Identifier: MIT
/*
 _______                       __              __                          __      __                       ______                        __                                     __     
|       \                     |  \            |  \                        |  \    |  \                     /      \                      |  \                                   |  \    
| $$$$$$$\  ______    ______   \$$  _______  _| $$_     ______   ______  _| $$_    \$$  ______   _______  |  $$$$$$\  ______   _______  _| $$_     ______   ______    _______  _| $$_   
| $$__| $$ /      \  /      \ |  \ /       \|   $$ \   /      \ |      \|   $$ \  |  \ /      \ |       \ | $$   \$$ /      \ |       \|   $$ \   /      \ |      \  /       \|   $$ \  
| $$    $$|  $$$$$$\|  $$$$$$\| $$|  $$$$$$$ \$$$$$$  |  $$$$$$\ \$$$$$$\\$$$$$$  | $$|  $$$$$$\| $$$$$$$\| $$      |  $$$$$$\| $$$$$$$\\$$$$$$  |  $$$$$$\ \$$$$$$\|  $$$$$$$ \$$$$$$  
| $$$$$$$\| $$    $$| $$  | $$| $$ \$$    \   | $$ __ | $$   \$$/      $$ | $$ __ | $$| $$  | $$| $$  | $$| $$   __ | $$  | $$| $$  | $$ | $$ __ | $$   \$$/      $$| $$        | $$ __ 
| $$  | $$| $$$$$$$$| $$__| $$| $$ _\$$$$$$\  | $$|  \| $$     |  $$$$$$$ | $$|  \| $$| $$__/ $$| $$  | $$| $$__/  \| $$__/ $$| $$  | $$ | $$|  \| $$     |  $$$$$$$| $$_____   | $$|  \
| $$  | $$ \$$     \ \$$    $$| $$|       $$   \$$  $$| $$      \$$    $$  \$$  $$| $$ \$$    $$| $$  | $$ \$$    $$ \$$    $$| $$  | $$  \$$  $$| $$      \$$    $$ \$$     \   \$$  $$
 \$$   \$$  \$$$$$$$ _\$$$$$$$ \$$ \$$$$$$$     \$$$$  \$$       \$$$$$$$   \$$$$  \$$  \$$$$$$  \$$   \$$  \$$$$$$   \$$$$$$  \$$   \$$   \$$$$  \$$       \$$$$$$$  \$$$$$$$    \$$$$ 
                    |  \__| $$                                                                                                                                                          
                     \$$    $$                                                                                                                                                          
                      \$$$$$$                                                                                                                                                           
*/

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Registration is Ownable {

    // LOAN PROVIDERS
    address[] private loanProviders;
    
    // LOAN BORROWERS 
    address[] private loanBorrowers;

    // type - Uint
    uint constant private Status_Success = 200;

    // type - Event
    event loanProviderRegistered(address indexed _loanProvider, uint indexed _success);
    event loanBorrowerRegistered(address indexed _loanBorrower, uint indexed _success);
    
    // type - Mapping
    mapping(address => bool) private isRegisteredLoanProvider;
    mapping(address => bool) private isRegisteredLoanBorrower;
    mapping(address => loanProvider) private storeLoanProvider;
    mapping(address => loanBorrower) private storeLoanBorrower;

    // type - Struct
    struct loanProvider{
        string first_name;
        string last_name;
        address wallet_address;
    }

    struct loanBorrower{
        string first_name;
        string last_name;
        string business_name;
        address wallet_address;
    }
    
    /**
     * @notice FUNCTION NAME : registerLoanProvider
     * @notice loan provider can register here
     */
    function registerLoanProvider(
        string memory _firstName, 
        string memory _lastName
        ) external {
        require(!isRegisteredLoanProvider[msg.sender],"This driver is already registered");
        storeLoanProvider[msg.sender].first_name = _firstName;
        storeLoanProvider[msg.sender].last_name = _lastName;
        storeLoanProvider[msg.sender].wallet_address = msg.sender;
        loanProviders.push(msg.sender);
        isRegisteredLoanProvider[msg.sender] = true;
        emit loanProviderRegistered(msg.sender, Status_Success);
    }

    /**
     * @notice FUNCTION NAME : registerLoanBorrower
     * @notice loan provider can register here
     */
    function registerLoanBorrower(
    string memory _firstName, 
    string memory _lastName, 
    string memory _businessName
    ) external {
        require(!isRegisteredLoanBorrower[msg.sender],"This driver is already registered");
        storeLoanBorrower[msg.sender].first_name = _firstName;
        storeLoanBorrower[msg.sender].last_name = _lastName;
        storeLoanBorrower[msg.sender].business_name = _businessName;
        loanBorrowers.push(msg.sender);
        isRegisteredLoanBorrower[msg.sender] = true;
        emit loanBorrowerRegistered(msg.sender, Status_Success);
    }

    /**
     * @notice FUNCTION NAME : isLoanProviderRegistered
     * @notice checks if the input loan provider address is registered or not
     * @param _loanProvider address of the loan provider which is to be checked if registered or not
     * @return registerLoanProviderState bool true if loan provider registered. false if not
     */
    function isLoanProviderRegistered(address _loanProvider) external view returns(bool registerLoanProviderState) {
        return isRegisteredLoanProvider[_loanProvider];
    }

    /**
     * @notice FUNCTION NAME : isLoanBorrowerRegistered
     * @notice checks if the input loan provider address is registered or not
     * @param _loanBorrower address of the loan provider which is to be checked if registered or not
     * @return registerLoanBorrowerState bool true if loan provider registered. false if not
     */
    function isLoanBorrowerRegistered(address _loanBorrower) external view returns(bool registerLoanBorrowerState) {
        return isRegisteredLoanBorrower[_loanBorrower];
    }

    /**
     * @dev returns an address[]
     * @return allLoanProviders address array that contains address of all loan providers
     */
    function getAllLoanProvidersAddress() external view returns(address[] memory allLoanProviders){
        return loanProviders;
    }

    /**
     * @dev returns an address[]
     * @return allLoanBorrowers address array that contains address of all loan borrowers
     */
    function getAllLoanBorrowersAddress() external view returns(address[] memory allLoanBorrowers){
        return loanBorrowers;
    }

    /**
     * @notice returnsLoanProviderDetails
     * @param _loanProvider - loan provider address
     */
    function returnLoanProviderDetails(address _loanProvider) external view returns(loanProvider memory lP){
        return storeLoanProvider[_loanProvider];
    }

    /**
     * @notice returnsLoanBorrowerDetails
     * @param _loanBorrower - loan borrower address
     */
    function returnLoanBorrowerDetails(address _loanBorrower) external view returns(loanBorrower memory lB){
        return storeLoanBorrower[_loanBorrower];
    }
}