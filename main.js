const SHA256 = require('crypto-js/sha256')

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock() {
    return new Block(0, "13/12/2017", "Genesis block", "0")
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
  }

  //BlockChains can't be changed unless all the blocks prior are invalidated
  isChainValid() {
    for (var i = 1; i < this.chain.length; i++) {
      var currentBlock = this.chain[i];
      var previousBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
      }
      if(previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }
    }

    return true;
  }
}

let snipCoin = new BlockChain()
snipCoin.addBlock(new Block(1, "14/12/2017", { amount: 4 }))
snipCoin.addBlock(new Block(2, "17/12/2017", { amount: 7 }))

console.log('Is BlockChain valid? ' + snipCoin.isChainValid())
snipCoin.chain[1].data = { amount: 100 }
console.log('Is BlockChain valid? ' + snipCoin.isChainValid())
// console.log(JSON.stringify(snipCoin, null, 4))
