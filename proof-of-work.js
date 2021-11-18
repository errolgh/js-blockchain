/* adds

mineBlock() method

nonce in Block constructor, calculateHash() while loop, addBlock()

difficulty to Blockchain constructor

mining test at the bottom

*/

const SHA256 = require("crypto-js/sha256");
// step 1 - create block
class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index        
        this.timestamp = timestamp        
        this.data = data        
        this.previousHash = previousHash
        this.hash = this.calculateHash()     
        this.nonce = 0 
    }
    //step 2 - calculate hash with sha256 (import crypto-js)
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce ++
            this.hash = this.calculateHash()
        }

        console.log(`Block mined: ${this.hash}`)
    }

}

// step 3 - create blockchain class
class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()] // the array of blocks starting with the genesis block
        this.difficulty = 2
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2022", "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash
        // newBlock.hash = newBlock.calculateHash()
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    // step 6 - validate chain
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]
            // validates current block hash
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            // validates previous block hash
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}


let ourCoin = new Blockchain();

console.log('Mining block 1... ')

ourCoin.addBlock(new Block(1, "01/02/2022", { amount: 4}));

console.log('Mining block 2... ')
ourCoin.addBlock(new Block(2, "01/03/2022", { amount: 12}));

// test 1 - run node proof-of-work.js

//=> NaN

// test 2 - change difficulty?