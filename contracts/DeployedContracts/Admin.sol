// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */

import "../Interfaces/IAdmin.sol";
import "../Base/StdPropositionBaseContract.sol";
import "../Libraries/AddressLibrary.sol";
import "../Libraries/Library.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";


contract Admin is IAdmin, StdPropositionBaseContract{
    using AddressLibrary for *;
    using Library for *;

    // EVENTS /////////////////////////////////////////
    event _NewManager(address Manager);

    // DATA /////////////////////////////////////////
    // Manager
    TransparentUpgradeableProxy private _Manager;

    // CONSTRUCTOR and INITIALIZATION /////////////////////////////////////////
    constructor(string memory contractName, string memory contractVersion, address managerContract, bytes memory managerInit) 
    {
        super.StdPropositionBaseContract_init(msg.sender, address(this), contractName, contractVersion);
        _Manager = new TransparentUpgradeableProxy(managerContract, address(this), managerInit);
    }

    // FUNCTIONALITY /////////////////////////////////////////
    // governance : contracts assignment and management
    function checkProposition(bytes[] memory NewValues) internal override 
    {
        require(address(0) != AddressLibrary.Bytes32ToAddress(Library.BytestoBytes32(_ProposedNewValues[0])[0]));
    }

    function UpdateAll() internal override
    {
        address NewImplAddress = AddressLibrary.Bytes32ToAddress(Library.BytestoBytes32(_ProposedNewValues[0])[0]);
        bytes memory Data = _ProposedNewValues[1];

        if(0 < Data.length)_Manager.upgradeToAndCall(NewImplAddress, Data);
        else _Manager.upgradeTo(NewImplAddress);

        emit _NewManager(NewImplAddress);
    }

    // configuration Proxies
    function retrieveManagerProxy() external override view returns (address) {
        return (address(_Manager));
    }

    // configuration implementations
    function retrieveManager() external override returns (address) {
        return _Manager.implementation();
    }
   
  
}