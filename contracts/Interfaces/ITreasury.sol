// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */

 import "../Libraries/Library.sol";

 interface ITreasury  {

    function pay(Library.Prices price) external payable;
    
    function updatePrices(uint256 PublicPriceUSD, uint256 PrivatePriceUSD, uint256 ProviderPriceUSD, uint256 CertificatePriceUSD, uint256 OwnerRefundPriceUSD) external;
    
    function getRefund(address addr, uint numberOfOwners) external;
    function withdraw(uint amount) external;
    function withdrawAll() external;

    function retrieveLastAssigned(address addr) external view returns(uint);
    function retrieveFullBalance(address addr) external view returns(uint);
    function retrievePrices() external view returns(uint, uint, uint, uint, uint);
    function retrieveAggregatedAmount() external view returns(uint);

}