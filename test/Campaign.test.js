const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());


const compiledFactory = require('../etherium/build/CampaignFactory.json');
const compiledCampaign = require('../etherium/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () =>{

    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '5000000'});    
    
    await factory.methods.createCampaign('100').send({
        from: accounts[1],
        gas: '5000000'
    });

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe('Campaings', () => {
    it('deploy a factory and a campaign', () => {
      assert.ok(factory.options.address);
      assert.ok(campaign.options.address); 
    });

    it('mark caller as the campaign manager', async() => {
       const manager = await campaign.methods.manager().call();
       assert.equal(accounts[1],manager);
    });

    it('allows people to contribute money and marks them as approvers', async() =>{
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);
    });

    it('requires a minimum contribution', async() => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async() =>{
        console.log(accounts[2]);
        await campaign.methods
        .createRequest('Buy Batteries', '200', '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2')
        .send({
            from: accounts[1],
            gas: '6000000'
        });

        // const request = await campaign.methods.requests(0).call();

        // assert.equal('Buy batteries', request.description);

    });




    


});