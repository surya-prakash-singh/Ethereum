const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //When we use a constructor function we capitalise it Web3 is a construction function

const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts,lottery;


beforeEach(async ()=> {
   
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode}) 
       .send({from: accounts[0],gas: '1000000'})

       lottery.setProvider(provider);
})


describe('Lottery',async () => {
    it('deploys a contract',()=>{
       assert.ok(lottery.options.address);
    })
    it('allow one account to enter lottery',async () => {
        await lottery.methods.enter().send({from:accounts[0],value: web3.utils.toWei('0.02','ether')});
        const players = await lottery.methods.getPlayers().call({from:accounts[0]})
        assert.equal(players[0],accounts[0])
        assert.equal(1,players.length)
    })

    it('multiple account to enter', async()=> { 
        await lottery.methods.enter().send({from:accounts[0],value: web3.utils.toWei('0.02','ether')});
        await lottery.methods.enter().send({from:accounts[1],value: web3.utils.toWei('0.02','ether')});
        await lottery.methods.enter().send({from:accounts[2],value: web3.utils.toWei('0.02','ether')});
        const players = await lottery.methods.getPlayers().call({from:accounts[0]})
        assert.equal(players[0],accounts[0]);
        assert.equal(players[1],accounts[1]);
        assert.equal(players[2],accounts[2]);
        assert.equal(3,players.length);
    });

    it('require a minimum amount of ether to enter',async () => {
        try{
        await lottery.methods.enter().send({from:accounts[0],value: 200});
        assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('if pickwinner is called by other function',async () => {
        try{
        await lottery.methods.pickWinner().send({from:accounts[1],value: 200});
        assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('manager,player enter lottery and manager picks a winner, player array is reset', async () => {
        await lottery.methods.enter().send({from:accounts[0],value: web3.utils.toWei("2",'ether')});

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8','ether'));

    })

})















