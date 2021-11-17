const SHA256 = require("crypto-js/sha256");
// step 1 - create block
class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index        
        this.timestamp = timestamp        
        this.data = data        
        this.previousHash = previousHash
        this.hash = this.calculateHash()      
    }
    //step 2 - calculate hash with sha256 (import crypto-js)
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
    }
}

// step 3 - create blockchain class
class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()] // the array of blocks starting with the genesis block
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2022", "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash()
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

// step 4 - run instance of blockchain
let ourCoin = new Blockchain();
ourCoin.addBlock(new Block(1, "01/02/2022", { amount: 4}));
ourCoin.addBlock(new Block(2, "01/03/2022", { amount: 12}));

// test 1 - does our blockchain run?
// console.log(JSON.stringify(ourCoin, null, 4)) //formatting with 4 spaces

// test 2 - is our chain valid?
// console.log('Is blockchain valid? ' + ourCoin.isChainValid())

// test 3 - hack/tamper with blockchain
// ourCoin.chain[1].data = { amount: 100};

// console.log('Is blockchain valid? ' + ourCoin.isChainValid()) //false

// test 4 - recalculate hash
// ourCoin.chain[1].data = { amount: 100};
// ourCoin.chain[1].hash = ourCoin.chain[1].calculateHash();
// console.log('Is blockchain valid? ' + ourCoin.isChainValid()) // false

// step 5 - run node main.js



/*
output = {
    "chain": [
        {
            "index": 0,
            "timestamp": "01/01/2022",
            "data": "Genesis block",
            "previousHash": "0",
            "hash": "e43ca773cc4de3e7cc04271c088648dfb5a8ad668080ed8f11fcf16ebec6fdb1"
        },
        {
            "index": 1,
            "timestamp": "01/02/2022",
            "data": {
                "amount": 4
            },
            "previousHash": "e43ca773cc4de3e7cc04271c088648dfb5a8ad668080ed8f11fcf16ebec6fdb1",
            "hash": "9cd6136ccd48954ac3f9b7a12ed9afe139bec3fded57ab7f01f6e396796d104b"
        },
        {
            "index": 2,
            "timestamp": "01/03/2022",
            "data": {
                "amount": 12
            },
            "previousHash": "9cd6136ccd48954ac3f9b7a12ed9afe139bec3fded57ab7f01f6e396796d104b",
            "hash": "b31276bf3fc239c61852061418bcdef825b870e644178ed1cf866701df6bb77b"
        }
    ]
}
*/