const path = require('path');
// const fs = require('fs');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

 
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
};

// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].Campaign.abi);
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];



// console.log(output.Campaign.abi);
// console.log("yesss");
// console.log(output.CampaignFactory.abi);

fs.ensureDirSync(buildPath);

for( let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract+'.json'),
        output[contract]
        );
}