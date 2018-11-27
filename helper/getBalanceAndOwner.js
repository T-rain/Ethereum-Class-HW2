const fs = require('fs')
const Web3 = require('web3')

let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(fs.readFileSync('./contract/Bank_sol_Bank.abi').toString())
const address = fs.readFileSync('./address.txt').toString()

let bank = new web3.eth.Contract(abi, address)

web3.eth.getAccounts().then(async function (accounts) {

    // get ether in bank
    bank.methods.getOwner().call({
        from: accounts[0]
    }).then((owner) => { 
        console.log("now owner");
        console.log(owner) 
    })

    let logFunction = function(type) {
        return async function(element) {
            let balance;
            if(type === 'Bank'){
                balance = await bank.methods.getBankBalance().call({from: accounts[element]})
            }else if(type === 'Coin'){
                balance = await bank.methods.getCoinBalance().call({from: accounts[element]})
            }
            console.log(" ");
            console.log(`AtAccount: ${accounts[element]}:`);
            console.log(`get${type}Balance:`)
            console.log(balance);
        };
    };

    let bblog = logFunction('Bank')
    let cblog = logFunction('Coin')

    await bblog(0)
    await cblog(0)
    await bblog(1)
    await cblog(1)
    await bblog(2)
    await cblog(2)

})