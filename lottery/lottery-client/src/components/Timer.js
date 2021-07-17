import React, { Component } from 'react'

class Timer extends Component {
  constructor(props){
    super(props)
    this.state = {
      count: props.count,
      target: 60
    }

  }


  setTargetTime(ntt){
    this.setState({target: ntt});
  }


  setTime(newTime){
    this.setState({count: newTime});
  }

  pad(num, size) {
      num = num.toString()
      while (num.length < size) num = "0" + num
      return num
  }

  formatText(seconds){
   var m = Math.floor(seconds/60)
   var s = seconds - m*60

   return this.pad(m, 2) + ":" + this.pad(s, 2)
  }



  render() {
    return (
      <table>
      <tr >
        <td>
          <p><small>Sledece </small></p>
        </td>
        <td rowspan='2' width='90px'>
          <h1> {this.formatText( this.state.count > 0 ? this.state.count : 0)}</h1>
        </td>
        </tr>

      <tr>
        <td>
          <p><small>izvlacenje &nbsp; &nbsp; </small> </p>
        </td>
      </tr>
        </table>
    )
  }

  intervalFunction = async () =>{
    if(this.state.count <= 0){
      console.log(this.state.target);
      let response = await fetch('http://localhost:4000/current-time');
      let json = await response.json();
      if(json.time == 0) return;
      this.setState({count: this.state.target - json.time});
      return;
    }


    this.setState({
        count: this.state.count - 1
    })
  }

startTimer(){
  this.myInterval = setInterval(this.intervalFunction, 1000)
}

clearTimer(){
  clearInterval(this.myInterval);
}


componentDidMount() {
  this.startTimer();
}

}

export default Timer
