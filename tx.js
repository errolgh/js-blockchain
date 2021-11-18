/* adds
- replaces data with transactions and remove index parameter from a block
- add transaction class
- pendingtransaction property to blockchain class, mining reward added 
- replace addblock with minependingtransactions
- create createTransaction function
- 
*/

class Transaction{
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}


const SHA256 = require("crypto-js/sha256");
// step 1 - create block
class Block {
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp        
        this.transactions = transactions
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
        this.pendingTransactions = []
        this.miningReward = 100

    }

    createGenesisBlock(){
        return new Block("01/01/2022", "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1]
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficulty)

        console.log('Block successfully mined!')
        this.chain.push(block)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    // actual balance is derived from transaction history, not transfer
    // of value from account to account. True ledger
    getBalanceOfAddress(address){
        let balance = 0

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                } 

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }

        return balance
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

ourCoin.createTransaction(new Transaction('address1', 'address2', 100))
ourCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\n Starting the miner... ')
ourCoin.minePendingTransactions('errolsAddress')

console.log('\nBalance of errol is: ', ourCoin.getBalanceOfAddress('errolsAddress'))

// => Balance of errol is: 0

/* 
    why? - the balance will not be updated until the next block is mined (pendingTransactions[])
*/

console.log('\n Starting the miner again... ')
ourCoin.minePendingTransactions('errolsAddress')

console.log('\nBalance of errol is: ', ourCoin.getBalanceOfAddress('errolsAddress'))

