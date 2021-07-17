const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
  '[12 words mnemonic]',
  '[access point]'
);

const web3 = new Web3(provider);
const deploy = async() => {
  const accounts = await web3.eth.getAccounts();
  console.log("Deploying....");
  const result = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({data: bytecode})
      .send({gas: '10000000', from: accounts[0]});

  console.log(interface);
  console.log('Contract deployed. Address:', result.options.address);
};
deploy();


//Address: 0x4e131cB62a8e7b293ffFdC013A83777A53e5B42A
