const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');
 
// const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
    'siren credit mesh enjoy soon wide long climb that dignity save cushion',
    'https://rinkeby.infura.io/v3/ae36943afc1f456eabd0385456819e87'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
   
    console.log('Attempting to deploy from account', accounts[0]);
   
    const result = await new web3.eth.Contract( compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object})
      .send({ gas: '5000000', from: accounts[0] });

    // console.log(abi);
    console.log(JSON.stringify(compiledFactory.abi))
    console.log('Contract deployed to', result.options.address);
    // provider.engine.stop();
};
  

// 0xd97F1A6985aC35540257D91006F09424F249cD80
deploy();


// [{"inputs":[{"internalType":"uint256","name":"minimum","type":"uint256"}],"name":"createCampaign","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xa3303a75"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deployedCampains","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x4af9edfe"},{"inputs":[],"name":"getDeployedCampaigns","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x4acb9d4f"}]