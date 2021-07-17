pragma solidity ^0.4.17;

contract Lottery {
    address public owner;
    address[] public players;
    address public lastWinner;


    function Lottery() public {
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256){
        return this.balance;
    }


    function enter() public payable {
        require(msg.value >= .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {

        uint index = random() % players.length;
        players[index].transfer(this.balance * 95/100);
        owner.transfer(this.balance);
        lastWinner = players[index];

        players = new address[](0);

    }

    function getPlayersCount() public view returns (uint) {
      return players.length;
    }

    modifier restricted() {
        require(msg.sender == owner);
        _;
    }



}
