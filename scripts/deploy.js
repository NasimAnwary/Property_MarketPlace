// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
async function main() {

  [seller, inspector, lender, buyer] = await ethers.getSigners()
 
  const RealEstate = await ethers.getContractFactory("RealEstate")
  const realEstate = await RealEstate.deploy()
  await realEstate.deployed()

console.log(`RealEstate deployed at: ${realEstate.address}`)
console.log(`Minting nfts: \n`)


  
const gasLimit = 3000000;
// Create and overrides object with the gas limit
const overrides = {
  gasLimit: gasLimit,
};


  for(let i=0; i<3; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`, overrides)
    await transaction.wait()
    console.log(`Minting nFT ID ${i+1}`)
  }


  const Escrow = await ethers.getContractFactory("Escrow")
  const escrow = await Escrow.deploy(
    seller.address,
    inspector.address,
    lender.address, 
    realEstate.address
  )
  await escrow.deployed()
  console.log(`deployed escrow at ${escrow.address}`)


  // const transaction1 = await realEstate.connect(seller).approve(escrow.address, 1)
  // await transaction1.wait()

  for(let i=1; i<4; i++) {
  const transaction = await realEstate.connect(seller).approve(escrow.address, i, overrides)
  await transaction.wait()
  console.log(`Approval nFT ID ${i}`)
  }


  const transaction2 = await escrow.connect(seller).list(1, buyer.address, tokens(20), tokens(10))
  await transaction2.wait()
  console.log(`NFT 1 listed`)

  const transaction3 = await escrow.connect(seller).list(2, buyer.address, tokens(15), tokens(10))
  await transaction3.wait()
  console.log(`NFT 2 listed`)

  const transaction4 = await escrow.connect(seller).list(3, buyer.address, tokens(30), tokens(15))
  await transaction4.wait()
  console.log(`NFT 3 listed`)
  

  
  
  console.log(`Finished.`)
  console.log(    
    seller.address,
    inspector.address,
    lender.address, 
    realEstate.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
