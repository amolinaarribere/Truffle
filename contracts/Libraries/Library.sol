// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

/*
Common functionality for all contracts and libraries
*/

library Library{

    // DATA /////////////////////////////////////////
    // enum
    enum Prices{NewProvider, NewPool, NewCertificate, NewProviderContract}

    // Structures
    // Certificate Manager
    struct ProposedContractsStruct{
        address NewPublicPoolAddress;
        address NewTreasuryAddress;
        address NewCertisTokenAddress;
        address NewPrivatePoolFactoryAddress;
        address NewPrivatePoolAddress;
        address NewProviderFactoryAddress;
        address NewProviderAddress;
        address NewPriceConverterAddress;
        bytes NewPublicPoolData;
        bytes NewTreasuryData;
        bytes NewCertisTokenData;
        bytes NewPrivatePoolFactoryData;
        bytes NewProviderFactoryData;
        bytes NewPriceConverterData;
        string NewPrivatePoolContractName;
        string NewPrivatePoolContractVersion;
    }

    // Pending Certificates
    struct _pendingCertificatesStruct{
        address pool;
        address holder;
        bytes32 certificate;
    }

    // MODIFIERS /////////////////////////////////////////
    modifier isIdCorrect(uint Id, uint length){
        require(true == IdCorrect(Id, length), "EC1-");
        _;
    }

    // FUNCTIONALITY /////////////////////////////////////////
    function IdCorrect(uint Id, uint length) public pure returns (bool){
        return (length > Id);
    }

    function ItIsSomeone(address someone) public view returns(bool){
        if(msg.sender == someone) return true;
        return false;
    }

    function ArrayRemoveResize(uint index, bytes32[] storage array) public 
        isIdCorrect(index, array.length) 
    {
        array[index] = array[array.length - 1];
        array.pop();
    }

    function Bytes32ArrayToString(bytes32[] memory element) public pure returns(string memory){
        return string(abi.encodePacked(element));
    }

    function BytestoBytes32(bytes memory _b) public pure returns(bytes32[] memory){
        uint num = _b.length / 32;
        bytes32[] memory result = new bytes32[](num + 1);
        uint t = 0;
        
        for(uint i=0; i<_b.length; i = i + 32){
            bytes32 r;
            uint p = i + 32;
             assembly {
                r := mload(add(_b, p))
            }
            result[t] = r;
            t += 1;
        }
       
        return result;
    }
    
}