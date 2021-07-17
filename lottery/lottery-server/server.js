const express = require('express');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

address = '[contract address]';
abi=[{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pickWinner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPlayersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"enter","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"players","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastWinner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];


const app = express();

const provider = new HDWalletProvider(
  '[12 word mnemonic]',
  '[access point]'
);

const web3 = new Web3(provider);

let accounts = [];
let lag = 0;

setUpAccounts = async () => {
  accounts = await web3.eth.getAccounts();
}

setUpAccounts();

let lottery = new web3.eth.Contract(abi, address);


const TARGET_TIME_IN_SECONDS = 120;
const TICKET_COST = 0.01;
let time = 0;


pickWinner = async() => {
  console.log('Picking a winner...');

 const playerCount = await lottery.methods.getPlayersCount().call();
  if(playerCount == 0){
      console.log('Not enough players. Timer restarts.');
      lag = 0;
      return;
  }

  try{
  lag = -30;
  await lottery.methods.pickWinner().send({
        gas: '1000000',
        from: accounts[0]
    });
    console.log('Winner is picked!')
  } catch(ex){
    console.log(ex);
  }
}

 function incrementTime(){
   if(lag==0)
      time++;
  else lag++;

  if(time == TARGET_TIME_IN_SECONDS){
    pickWinner();
    time = 0;
  }
}

interval = setInterval(incrementTime, 1000);

app.get('/', (req, res) => {
    res.send('<h1>Kurac</h1>')
});

app.get('/target-time', (req, res) => {
  targTimeObj = {targetTime: TARGET_TIME_IN_SECONDS}
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(targTimeObj);
})

app.get('/current-time', (req, res) =>{
  timeObj = {time: time}
  console.log('current time requested');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(timeObj);
})

app.get('/cost', (req, res) => {
  costObj = {cost: TICKET_COST};
  console.log('cost requested');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(costObj);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
