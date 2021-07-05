// Chai library for testing
// ERROR tests = First we test the error message then we test the action was not carried out

const CertificatesPoolManager = artifacts.require("CertificatesPoolManager");
const PrivateCertificates = artifacts.require("PrivateCertificatesPool");
var PrivateCertificatesAbi = PrivateCertificates.abi;
const Library = artifacts.require("./Libraries/Library");

const PublicPriceWei = 10;
const PrivatePriceWei = 20;
const Gas = 6721975;

// TEST -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------

contract("Testing Private Pool",function(accounts){
    var certPoolManager;
    var privateCertPool;
    // used addresses
    const chairPerson = accounts[0];
    const PublicOwners = [accounts[1], accounts[2], accounts[3]];
    const minOwners = 2;
    const provider_1 = accounts[4]; 
    const provider_2 = accounts[5];
    const provider_3 = accounts[6]; 
    const user_1 = accounts[7];
    const holder_1 = accounts[8];
    const holder_2 = accounts[9];
    const PrivateOwners = [accounts[0], accounts[5], accounts[9]];
    // providers info
    const provider_1_Info = "Provider 1 Info";
    const provider_2_Info = "Provider 2 Info";
    // certificates
    const hash_1 = "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";
    const hash_2 = "0x3fd54832f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";
    // test constants
    const NotAnOwner = new RegExp("EC9");
    const OwnerAlreadyvoted = new RegExp("EC5");
    const NotAllowedRemoveEntity = new RegExp("EC10");
    const MustBeActivated = new RegExp("EC7");
    const NotAProvider = new RegExp("EC12");
    const CertificateAlreadyExists = new RegExp("EC15");
    const NotAllowedToRemoveCertificate = new RegExp("EC14");

    beforeEach(async function(){
        certPoolManager = await CertificatesPoolManager.new(PublicOwners, minOwners, PublicPriceWei, PrivatePriceWei, {from: chairPerson});
        await certPoolManager.createPrivateCertificatesPool(PrivateOwners, minOwners, {from: user_1, value: PrivatePriceWei});
        let response = await certPoolManager.retrievePrivateCertificatesPool(0, {from: user_1});
        const {0: creator, 1: privateCertPoolAddress} = response;
        privateCertPool = new web3.eth.Contract(PrivateCertificatesAbi, privateCertPoolAddress);      
    });

    async function AddingProviders(){
        await privateCertPool.methods.addProvider(provider_1, provider_1_Info).send({from: PrivateOwners[0], gas: Gas}, function(error, result){});
        await privateCertPool.methods.addProvider(provider_1, "").send({from: PrivateOwners[1], gas: Gas}, function(error, result){});
        await privateCertPool.methods.addProvider(provider_2, provider_2_Info).send({from: PrivateOwners[1], gas: Gas}, function(error, result){});
        await privateCertPool.methods.addProvider(provider_2, "text that will not be updated").send({from: PrivateOwners[2], gas: Gas}, function(error, result){});
    }

    async function AddingCertificate(){
        await privateCertPool.methods.addCertificate(hash_1, holder_1).send({from: provider_1, gas: Gas}, function(error, result){});
        await privateCertPool.methods.addCertificate(hash_1, holder_2).send({from: provider_1, gas: Gas}, function(error, result){});
        await privateCertPool.methods.addCertificate(hash_2, holder_1).send({from: provider_2, gas: Gas}, function(error, result){});
        await privateCertPool.methods.addCertificate(hash_2, holder_2).send({from: provider_2, gas: Gas}, function(error, result){});
    }

    // ****** TESTING Adding Provider ***************************************************************** //

    it("Add Provider WRONG",async function(){
        // act
        try{
            await privateCertPool.methods.addProvider(provider_1, provider_1_Info).send({from: user_1}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(NotAnOwner);
        }
        // act
        try{
            await privateCertPool.methods.addProvider(provider_1, provider_1_Info).send({from: PrivateOwners[0], gas: Gas}, function(error, result){});
            await privateCertPool.methods.addProvider(provider_1, provider_1_Info).send({from: PrivateOwners[0], gas: Gas}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(OwnerAlreadyvoted);
        }
    });

    it("Add Provider CORRECT",async function(){
        // act
        await AddingProviders();
        // assert
        let Provider_1 = await privateCertPool.methods.retrieveProvider(provider_1).call({from: user_1}, function(error, result){});
        let Provider_2 = await privateCertPool.methods.retrieveProvider(provider_2).call({from: user_1}, function(error, result){});
        let Total = await privateCertPool.methods.retrieveTotalProviders().call({from: user_1}, function(error, result){});
        let AllProviders = await privateCertPool.methods.retrieveAllProviders().call({from: user_1}, function(error, result){});
        expect(Provider_1).to.equal(provider_1_Info);
        expect(Provider_2).to.equal(provider_2_Info);
        expect(Total).to.equal("2");
        expect(AllProviders[0]).to.equal(provider_1);
        expect(AllProviders[1]).to.equal(provider_2);
    });

    // ****** TESTING Removing Provider ***************************************************************** //

    it("Removing Provider WRONG",async function(){
        // act
        await AddingProviders();

        try{
            await privateCertPool.methods.removeProvider(provider_1).send({from: user_1}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(NotAllowedRemoveEntity);
        }
        // act
        try{
            await privateCertPool.methods.removeProvider(provider_3).send({from: PrivateOwners[0]}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(MustBeActivated);
        }
        // act
        try{
            await privateCertPool.methods.removeProvider(provider_1).send({from: PrivateOwners[0], gas: Gas}, function(error, result){});
            await privateCertPool.methods.removeProvider(provider_1).send({from: PrivateOwners[0], gas: Gas}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(OwnerAlreadyvoted);
        }
    });

    it("Removing Provider CORRECT",async function(){
        // act
        await AddingProviders();
        await privateCertPool.methods.removeProvider(provider_1).send({from: PrivateOwners[2], gas: Gas}, function(error, result){});
        await privateCertPool.methods.removeProvider(provider_1).send({from: PrivateOwners[0], gas: Gas}, function(error, result){});
        // assert
        let Total = await privateCertPool.methods.retrieveTotalProviders().call({from: user_1}, function(error, result){});
        expect(Total).to.equal("1");
    });

    // ****** TESTING Adding Certificate ***************************************************************** //

    it("Adding Certificate WRONG",async function(){
        // act
        await AddingProviders();

        try{
            await privateCertPool.methods.addCertificate(hash_1, holder_1).send({from: user_1}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(NotAProvider);
        }
        // act
        try{
            await privateCertPool.methods.addCertificate(hash_1, holder_1).send({from: provider_1, gas: Gas}, function(error, result){});
            await privateCertPool.methods.addCertificate(hash_1, holder_1).send({from: provider_1, gas: Gas}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(CertificateAlreadyExists);
        }
        
    });

    it("Adding Certificate CORRECT",async function(){
        // act
        await AddingProviders();
        await AddingCertificate();
        // assert
        let Provider_1 = await privateCertPool.methods.retrieveCertificateProvider(hash_1, holder_1).call({from: user_1}, function(error, result){});
        let Provider_1b = await privateCertPool.methods.retrieveCertificateProvider(hash_1, holder_2).call({from: user_1}, function(error, result){});
        let Provider_2 = await privateCertPool.methods.retrieveCertificateProvider(hash_2, holder_1).call({from: user_1}, function(error, result){});
        let Provider_2b = await privateCertPool.methods.retrieveCertificateProvider(hash_2, holder_2).call({from: user_1}, function(error, result){});
        let TotalHolder_1 = await privateCertPool.methods.retrieveTotalCertificatesByHolder(holder_1).call({from: user_1}, function(error, result){});
        let TotalHolder_2 = await privateCertPool.methods.retrieveTotalCertificatesByHolder(holder_2).call({from: user_1}, function(error, result){});
        let CertificatesHolder1 = await privateCertPool.methods.retrieveCertificatesByHolder(holder_1, 0, 2).call({from: user_1}, function(error, result){});
        let CertificatesHolder1b = await privateCertPool.methods.retrieveCertificatesByHolder(holder_1, 1, 20).call({from: user_1}, function(error, result){});
        let CertificatesHolder2 = await privateCertPool.methods.retrieveCertificatesByHolder(holder_2, 0, 2).call({from: user_1}, function(error, result){});
        let CertificatesHolder2b = await privateCertPool.methods.retrieveCertificatesByHolder(holder_2, 0, 1).call({from: user_1}, function(error, result){});
        
        expect(Provider_1).to.equal(provider_1);
        expect(Provider_1b).to.equal(provider_1);
        expect(Provider_2).to.equal(provider_2);
        expect(Provider_2b).to.equal(provider_2);
        expect(TotalHolder_1).to.equal("2");
        expect(TotalHolder_2).to.equal("2");
        expect(CertificatesHolder1[0]).to.equal(hash_1);
        expect(CertificatesHolder1[1]).to.equal(hash_2);
        expect(CertificatesHolder2[0]).to.equal(hash_1);
        expect(CertificatesHolder2[1]).to.equal(hash_2);
        expect(CertificatesHolder1b[0]).to.equal(hash_2);
        expect(CertificatesHolder2b[0]).to.equal(hash_1);
    });

    // ****** TESTING Removing Certificate ***************************************************************** //

    it("Removing Certificate WRONG",async function(){
        // act
        await AddingProviders();
        await AddingCertificate();

        try{
            await privateCertPool.methods.removeCertificate(hash_1, holder_1).send({from: user_1}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(NotAProvider);
        }
        // act
        try{
            await privateCertPool.methods.removeCertificate(hash_1, holder_1).send({from: provider_2}, function(error, result){});
            expect.fail();
        }
        // assert
        catch(error){
            expect(error.message).to.match(NotAllowedToRemoveCertificate);
        }
        
    });

    it("Removing Certificate CORRECT",async function(){
        // act
        await AddingProviders();
        await AddingCertificate();
        await privateCertPool.methods.removeCertificate(hash_1, holder_1).send({from: provider_1, gas: Gas}, function(error, result){});
        // assert
        let Total = await privateCertPool.methods.retrieveTotalCertificatesByHolder(holder_1).call({from: user_1}, function(error, result){});
        expect(Total).to.equal("1");
    });
 

});