const path = require('path'); //BY using path we get cross platform compatibility and also we dont directly import sol file because its not js file
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname,"contracts","inbox.sol");  //Generate path to contract file
const source = fs.readFileSync(inboxPath,"utf8");   //To read source code of sol file.


module.exports = solc.compile(source,1).contracts[":Inbox"]; //bytecode original source code and interface is abi list of function etc