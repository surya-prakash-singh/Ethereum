const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode} = require('./compile');


const provider = new HDWalletProvider(
    'ladder large heart unhappy anxiety sting fix cream friend rhythm slight action',
    'https://rinkeby.infura.io/v3/3d116f8970664df2b977047bd66ced49'
);


const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();

    console.log("------Attempting to deploy from account",accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
                         .deploy({data: bytecode})
                         .send({from:accounts[0],gas: '1000000'})

    console.log("----------contractinterface", interface);
    console.log("----------contract deployed to", result.options.address);

};

deploy();
