const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //When we use a constructor function we capitalise it Web3 is a construction function

const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts,inbox;
const INITIAL_STRING = "HI there!"


beforeEach(async ()=> {
    //Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    //Use one of those accounts to deploy 
                     //Contract allow us to interact with existing cotract on ethereum or create new contract
                     //interface is the ABI thats json representation of contract  Hey contract out there and this is the interface
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode,arguments: ['HI there!']}) //Tells web3 that we want to create/deploy a new transaction
       .send({from: accounts[0],gas: '1000000'}) //Instructs web3 to send out a transaction that creates this contract

       inbox.setProvider(provider);
})


describe('Inbox',async () => {
    it('deploys a contract',()=>{
       assert.ok(inbox.options.address);
    })
    it('has a default message',async () => {      //when we call a method on contract the first set of parenthesis have all argument that we pass on call parenthesis is used to customize the transaction.it accept a object to modify transaction data
        const message = await inbox.methods.message().call();
        assert.equal(message,"HI there!")
    })

    it('can change the message', async()=> { //we get transactional hash after a transaction to a function
        await inbox.methods.setMessage('bye').send({from:accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message,"bye")
    })
})

















// class Car {

//     park(){
//         return 'stopped'
//     }

//     drive() {
//         return 'vroom';
//     }
// }


// describe('Car Class',() =>{
//     let car;
//     beforeEach(()=>{
//         car = new Car();
//     })

//     it('can park',()=> {
//         assert.equal(car.park(), 'stopped');
//     })

//     it('can drive',()=> {
//         assert.equal(car.drive(), 'vroom');
//     })
// })
