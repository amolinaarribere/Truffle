// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */

import "./GenericProxy.sol";


contract CertisTokenProxy is GenericProxy{

    // CONSTRUCTOR /////////////////////////////////////////
    constructor(address CertisCodeContractAddress, address managerContractAddress, bytes memory data)
        GenericProxy(CertisCodeContractAddress, managerContractAddress, data) 
    {}

    // CUSTOMIZATION /////////////////////////////////////////
    function _beforeFallback() internal virtual override {}

    // MODIFIERS /////////////////////////////////////////
    /*modifier ifAdmin() {
        require(msg.sender == _getAdmin(), "EC8"); 
        _;
    }

    // CONSTRUCTOR /////////////////////////////////////////
    constructor(address CertisCodeContractAddress, address managerContractAddress, bytes memory data)
        ERC1967Proxy(CertisCodeContractAddress, data)
    {
        _changeAdmin(managerContractAddress);
    }

    function admin() external view returns (address admin_) {
        admin_ = _getAdmin();
    }

    function implementation() external view returns (address implementation_) {
        implementation_ = _implementation();
    }

    function changeAdmin(address newAdmin) external virtual ifAdmin {
        _changeAdmin(newAdmin);
    }

    function upgradeTo(address newImplementation) external ifAdmin {
        _upgradeToAndCall(newImplementation, bytes(""), false);
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable ifAdmin {
        _upgradeToAndCall(newImplementation, data, true);
    }*/

}