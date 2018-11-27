const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('./contract/Bank_sol_Bank.abi').toString())
const address = fs.readFileSync('./address.txt').toString()

let bank = new web3.eth.Contract(abi, address)

web3.eth.getAccounts().then(function (accounts) {

    const ethValue = web3.utils.toHex(web3.utils.toBN(1 * 10**18));
   
    // In Bank.sol,add a helper function to quick generate owner bank value
    // mint bank
    // function mintBank(uint256 coinValue) public isOwner {
    //     uint256 value = coinValue * 1 ether;
    //     balance[msg.sender] += value;
    //     emit MintEvent(msg.sender,coinValue,now);
    // }
    bank.methods.getOwner().call({
        from: accounts[0]
    }).then((owner) => { 
      console.log("now owner: "+owner);
      
      bank.methods.mintBank(ethValue).send({
        from: owner,
        gas: 3400000
      })
      // .on('receipt', console.log)
      .on('error', console.error)
      .then(function(){
        console.log("mintBank:");
        console.log(ethValue);
        console.log("Then transfer bank ethValue from owner to accounts[1]");

        bank.methods.transfer(accounts[1], ethValue).send({
          from: owner,
          gas: 3400000
        })
          // .on('receipt', console.log)
          .on('error', console.error)
      })
    })
})