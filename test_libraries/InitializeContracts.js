const CertificatesPoolManager = artifacts.require("CertificatesPoolManager");
const Treasury = artifacts.require("Treasury");
const TreasuryAbi = Treasury.abi;
const PublicCertificatesPool = artifacts.require("PublicCertificatesPool");
const PublicCertificatesPoolAbi = PublicCertificatesPool.abi;
const PrivateCertificatesPool = artifacts.require("PrivateCertificatesPool");
const Provider = artifacts.require("Provider");
const CertisToken = artifacts.require("CertisToken");
const CertisTokenAbi = CertisToken.abi;
const PrivatePoolFactory = artifacts.require("PrivatePoolFactory");
const PrivatePoolFactoryAbi = PrivatePoolFactory.abi;
const ProviderFactory = artifacts.require("ProviderFactory");
const ProviderFactoryAbi = ProviderFactory.abi;

const GenericProxy = artifacts.require("GenericProxy");
const CertisTokenProxy = artifacts.require("CertisTokenProxy");


const constants = require("../test_libraries/constants.js");

const PublicPriceWei = constants.PublicPriceWei;
const PrivatePriceWei = constants.PrivatePriceWei;
const ProviderPriceWei = constants.ProviderPriceWei;
const CertificatePriceWei = constants.CertificatePriceWei;
const OwnerRefundPriceWei = constants.OwnerRefundPriceWei;
const PropositionLifeTime = constants.PropositionLifeTime;
const PropositionThresholdPercentage = constants.PropositionThresholdPercentage;
const minPercentageToPropose = constants.minPercentageToPropose;
const TotalTokenSupply = constants.TotalTokenSupply;
const Gas = constants.Gas;

const CertisTokenProxyInitializerMethod = {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "decimalsValue",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "MaxSupply",
        "type": "uint256"
      }
    ],
    "name": "CertisToken_init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};
var TreasuryProxyInitializerMethod = {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "PublicPriceWei",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PrivatePriceWei",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ProviderPriceWei",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "CertificatePriceWei",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "OwnerRefundPriceWei",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "managerContractAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "PropositionLifeTime",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "PropositionThresholdPercentage",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "minWeightToProposePercentage",
        "type": "uint8"
      }
    ],
    "name": "Treasury_init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};
var PrivatePoolFactoryProxyInitializerMethod = {
    "inputs": [
      {
        "internalType": "address",
        "name": "managerContractAddress",
        "type": "address"
      }
    ],
    "name": "PrivatePoolFactory_init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};
var ProviderFactoryProxyInitializerMethod = {
  "inputs": [
    {
      "internalType": "address",
      "name": "managerContractAddress",
      "type": "address"
    }
  ],
  "name": "ProviderFactory_init",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
};
var PublicCertificatesPoolProxyInitializerMethod = {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "owners",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "minOwners",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "managerContractAddress",
        "type": "address"
      }
    ],
    "name": "PublicCertPool_init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
};

async function InitializeContracts(chairPerson, PublicOwners, minOwners, user_1){
  let certPoolManager = await CertificatesPoolManager.new(PropositionLifeTime, PropositionThresholdPercentage, minPercentageToPropose, {from: chairPerson});
  let implementations = await deployImplementations(user_1);
  let proxies = await deployProxies(chairPerson, PublicOwners, minOwners, user_1, implementations[0], implementations[1], implementations[2], implementations[3], implementations[5], certPoolManager.address)

  await certPoolManager.InitializeContracts(proxies[1], proxies[2], proxies[0], proxies[3], implementations[4], proxies[4], implementations[6], {from: chairPerson});

  return [certPoolManager, proxies, implementations];
}

async function deployImplementations(user_1){
    let certisToken = await CertisToken.new({from: user_1});
    let publicPool = await PublicCertificatesPool.new({from: user_1});
    let treasury = await Treasury.new({from: user_1});
    let privatePoolFactory = await PrivatePoolFactory.new({from: user_1});
    let privatePool = await PrivateCertificatesPool.new({from: user_1});
    let providerFactory = await ProviderFactory.new({from: user_1});
    let provider = await Provider.new({from: user_1});

    return [certisToken.address, publicPool.address, treasury.address, privatePoolFactory.address, privatePool.address, providerFactory.address, provider.address];
}

async function deployProxies(chairPerson, PublicOwners, minOwners, user_1, certisToken, publicPool, treasury, privatePoolFactory, providerFactory, certPoolManager){
  let CertisTokenProxyInitializerParameters = ["Certis Token for Test", "CERT", 0, TotalTokenSupply];
  let CertisProxyData = web3.eth.abi.encodeFunctionCall(CertisTokenProxyInitializerMethod, CertisTokenProxyInitializerParameters);
  let certisTokenProxy = await CertisTokenProxy.new(certisToken, certPoolManager, CertisProxyData, {from: chairPerson});

  let PublicCertificatesPoolProxyInitializerParameters = [PublicOwners, minOwners, certPoolManager];
  let PublicCertificatesPoolProxyData = web3.eth.abi.encodeFunctionCall(PublicCertificatesPoolProxyInitializerMethod, PublicCertificatesPoolProxyInitializerParameters);
  let publicPoolProxy = await GenericProxy.new(publicPool, certPoolManager, PublicCertificatesPoolProxyData, {from: user_1});

  let TreasuryProxyInitializerParameters = [PublicPriceWei, PrivatePriceWei, ProviderPriceWei, CertificatePriceWei, OwnerRefundPriceWei, certPoolManager,  PropositionLifeTime, PropositionThresholdPercentage, minPercentageToPropose];
  let TreasuryProxyData = web3.eth.abi.encodeFunctionCall(TreasuryProxyInitializerMethod, TreasuryProxyInitializerParameters);
  let treasuryProxy = await GenericProxy.new(treasury, certPoolManager, TreasuryProxyData, {from: chairPerson});

  let PrivatePoolFactoryProxyInitializerParameters = [certPoolManager];
  let PrivatePoolFactoryProxyData = web3.eth.abi.encodeFunctionCall(PrivatePoolFactoryProxyInitializerMethod, PrivatePoolFactoryProxyInitializerParameters);  
  let privatePoolFactoryProxy = await GenericProxy.new(privatePoolFactory, certPoolManager, PrivatePoolFactoryProxyData, {from: user_1});

  let ProviderFactoryProxyInitializerParameters = [certPoolManager];
  let ProviderFactoryProxyData = web3.eth.abi.encodeFunctionCall(ProviderFactoryProxyInitializerMethod, ProviderFactoryProxyInitializerParameters);  
  let providerFactoryProxy = await GenericProxy.new(providerFactory, certPoolManager, ProviderFactoryProxyData, {from: user_1});

  return [certisTokenProxy.address, publicPoolProxy.address, treasuryProxy.address, privatePoolFactoryProxy.address, providerFactoryProxy.address];
}

async function InitializeManagedBaseContracts(chairPerson, PublicOwners, minOwners, user_1, certPoolManagerAddress){
  let implementations = await deployImplementations(user_1);

  let certisToken = new web3.eth.Contract(CertisTokenAbi, implementations[0]);
  await certisToken.methods.CertisToken_init("Certis Token for Test", "CERT", 0, TotalTokenSupply).send({from: chairPerson, gas: Gas});

  let publicPool = new web3.eth.Contract(PublicCertificatesPoolAbi, implementations[1]);
  await publicPool.methods.PublicCertPool_init(PublicOwners, minOwners, certPoolManagerAddress).send({from: user_1, gas: Gas});

  let treasury = new web3.eth.Contract(TreasuryAbi, implementations[2]);
  await treasury.methods.Treasury_init(PublicPriceWei, PrivatePriceWei, ProviderPriceWei, CertificatePriceWei, OwnerRefundPriceWei, certPoolManagerAddress, PropositionLifeTime, PropositionThresholdPercentage, minPercentageToPropose).send({from: chairPerson, gas: Gas});

  let privatePoolFactory = new web3.eth.Contract(PrivatePoolFactoryAbi, implementations[3]);
  await privatePoolFactory.methods.PrivatePoolFactory_init(certPoolManagerAddress).send({from: user_1, gas: Gas});

  let providerFactory = new web3.eth.Contract(ProviderFactoryAbi, implementations[5]);
  await providerFactory.methods.ProviderFactory_init(certPoolManagerAddress).send({from: user_1, gas: Gas});

  return implementations;
}

exports.InitializeContracts = InitializeContracts;
exports.InitializeManagedBaseContracts = InitializeManagedBaseContracts;