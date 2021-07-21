// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */

import "./Libraries/Library.sol";
import "./PrivateCertificatesPool.sol";
import "./PublicCertificatesPool.sol";
import "./Treasury.sol";

contract CertificatesPoolManager{
    using Library for *;

    // events
    event _NewCertificatesPool(uint256, address, MultiSigCertificatesPool);
    event _SendProposalId(address);

    // modfiers
    modifier isIdCorrect(uint Id, uint length){
        require(true == Library.IdCorrect(Id, length), "EC1");
        _;
    }

    modifier isFromChairPerson(){
        require(msg.sender == _chairperson, "only chair person");
        _;
    }
    
    // Private Certificates Pool structure
    struct _privateCertificatesPoolStruct{
        address _creator;
        PrivateCertificatesPool _PrivateCertificatesPool;
    } 

    _privateCertificatesPoolStruct[] _PrivateCertificatesPools;
    
    // Public Certificates Pool structure
    PublicCertificatesPool  _PublicCertificatesPool;

    // Treasury
    Treasury _Treasury;

    address _chairperson;
    
    constructor() {
        _chairperson = msg.sender; 
    }

    function Initialize(address PublicPoolAddress, address TreasuryAddress) 
        isFromChairPerson()
    external{
        _PublicCertificatesPool = PublicCertificatesPool(PublicPoolAddress);
        _Treasury = Treasury(TreasuryAddress);
        _PublicCertificatesPool.addTreasury(TreasuryAddress);
    }

    function createPrivateCertificatesPool(address[] memory owners,  uint256 minOwners) external
    payable
    {
        _Treasury.pay{value:msg.value}(Library.Prices.NewPool);
        PrivateCertificatesPool certificatePool = new PrivateCertificatesPool(owners, minOwners);
        _privateCertificatesPoolStruct memory privateCertificatesPool = _privateCertificatesPoolStruct(msg.sender, certificatePool);
        _PrivateCertificatesPools.push(privateCertificatesPool);

        emit _NewCertificatesPool(_PrivateCertificatesPools.length - 1, privateCertificatesPool._creator, privateCertificatesPool._PrivateCertificatesPool);
    }

    function retrievePrivateCertificatesPool(uint certificatePoolId) external
        isIdCorrect(certificatePoolId, _PrivateCertificatesPools.length)
    view returns (address, MultiSigCertificatesPool)
    {
        return(_PrivateCertificatesPools[certificatePoolId]._creator, _PrivateCertificatesPools[certificatePoolId]._PrivateCertificatesPool);
    }

    function retrieveTotalPrivateCertificatesPool() external view returns (uint)
    {
        return(_PrivateCertificatesPools.length);
    }
    
    function retrieveConfiguration() external view returns (Treasury, MultiSigCertificatesPool, address, uint) {
        return (_Treasury, _PublicCertificatesPool, _chairperson, address(this).balance);
    }
    
}