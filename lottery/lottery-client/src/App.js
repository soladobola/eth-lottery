import React, { Component } from 'react'
import Timer from './components/Timer.js'
import web3 from './web3';
import lottery from './lottery';
import Loader from "react-loader-spinner";


class App extends Component{

  constructor(props){
    super(props)
    this.state = {
      count: 0,
      targetTime: 0,
      playersNum: '...',
      winMoney: '...',
      cost: '...',
      lastWinner: '...',
      sendStatus: 0,
    }
    this.timerRef = React.createRef();
    this.accounts = [];
  };

// status 0: view
// status 1: pending
// status 2: success
// status 3: fail


showMessage = () => {

  if(this.state.sendStatus == 0){
    return (
      <></>
    )
  }
  if(this.state.sendStatus == 1){
    return (
      <h3>Transakcija se obrađuje...</h3>
    )
  }
  if(this.state.sendStatus == 2){
    return (
      <h3 style={{color: 'green'}}>Poslednja transakcija je uspešna.</h3>
    )
  }
  if(this.state.sendStatus == 3){
    return (
      <h3 style={{color: 'red'}}>Poslednja transakcija je neuspešna.</h3>
    )
  }


}

onSubmit = async (event) => {
  event.preventDefault();
  this.setState({sendStatus: 1});
  try{
      await lottery.methods.enter().send({
        from: this.accounts[0],
        value: web3.utils.toWei(this.state.cost.toString(), 'ether')
      });

    this.setState({sendStatus: 2});

    }  catch(err) {

    this.setState({sendStatus: 3});

}
}


showForm = () => {
  return (
  <form onSubmit={this.onSubmit}>
      <h2> Učestvuj i ti!</h2>
      <div>
        <h3> Cena: {this.state.cost} ether</h3>

        </div>
        <button className='btn'> Enter </button>
    </form>);

}

showSpinner = () => {
  return (

    <table>
    <tr>
    <Loader
        type="Grid"
        color="#00BFFF"
        height={100}
        width={100}

      />
      </tr>
      <tr>

      <h3> Obrada...</h3>
      </tr>
      </table>

  );
}


entryLayout = () => {

  if(this.state.sendStatus == 0){
    return this.showForm();
  }
  if(this.state.sendStatus == 1){
    return this.showSpinner();
  }
  if(this.state.sendStatus == 2){
    return this.showForm();
  }
  if(this.state.sendStatus == 3){
    return this.showForm();
  }

}

render(){
  return (
    <div className="container">
      <div className="firstRow">
      <h1 >Svilajnac-Bet</h1>
      <Timer count='70' ref={this.timerRef} />
      </div>

      <hr />

      {/* druga red*/}
      <div style={{paddingTop: '20px'}}>
        <h2>Broj igraca: {this.state.playersNum}</h2>
      </div>

      <div className='firstRow' style={{paddingTop: '20px'}} >
        <h2>Nagradni fond: { this.state.winMoney != '...' ? web3.utils.fromWei(this.state.winMoney.toString(), 'ether') : '...'}</h2>

        {this.entryLayout()}


      </div>

      {this.showMessage()}

      <div style={{paddingTop: '10px'}} > </div>

      <div>
        <h3>Poslednji dobitnik:</h3>
        <h4>{this.state.lastWinner}</h4>

      </div>

    </div>
  );
}

// promises better
updateStates = async() => {
  const plNum = await lottery.methods.getPlayersCount().call();
  const wMoney = await lottery.methods.getBalance().call();
  const lWinner = await lottery.methods.lastWinner().call();

  this.setState({playersNum: plNum});
  this.setState({winMoney: wMoney});
  this.setState({lastWinner: lWinner});
}


 onInit = async() => {
        await window.ethereum.enable();
        this.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

         window.ethereum.on('accountsChanged', function (accounts) {

           });
    }




async componentDidMount(){

  this.onInit();

  this.updateStates();

  let response = await fetch('http://localhost:4000/target-time');
  let json = await response.json();
  this.setState({targetTime: json.targetTime})
  this.timerRef.current.setTargetTime(json.targetTime);

  response = await fetch('http://localhost:4000/current-time');
  json = await response.json();
  this.timerRef.current.setTime(this.state.targetTime - json.time);

  response = await fetch('http://localhost:4000/cost');
  json = await response.json();
  this.setState({cost: json.cost});
  setInterval(this.updateStates, 1000);

}

}

export default App;
