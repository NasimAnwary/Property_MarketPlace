
//  Expect is a function from the chai assertion library
//  Ethers is an object from the hardhat toolbox

const { toBeRequired } = require('@testing-library/jest-dom/matchers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let seller, inspector, lender, buyer;
    let realEstate, escrow;
    
    beforeEach(async() => {
        [seller, inspector, lender, buyer] = await ethers.getSigners()
 
        const RealEstate = await ethers.getContractFactory("RealEstate")
        realEstate = await RealEstate.deploy()

        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
        await transaction.wait()

        const Escrow = await ethers.getContractFactory("Escrow")
        escrow = await Escrow.deploy(
            seller.address,
            inspector.address,
            lender.address,
            realEstate.address
        )

        // Approves escrow address to take control of sellers nft no1

        let transaction2 = await realEstate.connect(seller).approve(escrow.address, 1)
        await transaction2.wait()

        // List the property

        let transaction1 = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5))
        await transaction1.wait()



    })



    describe('Escrow', () => {


    it("Saves the correct NFT address", async() => {
        let result = await escrow.nftAddress()
        expect(result).to.be.equal(realEstate.address)
    })
    it("Saves the correct seller address", async() => {
        let result = await escrow.seller()
        expect(result).to.be.equal(seller.address)
    })
    it("Saves the correct inspector address", async() => {
        let result = await escrow.inspector()
        expect(result).to.be.equal(inspector.address)
    })
    it("Saves the correct lender address", async() => {
        let result = await escrow.lender()
        expect(result).to.be.equal(lender.address)

    })
    })
    describe('Listing', () => {

    it("Is the property listed?", async() => {
        let result = await escrow.isListed(1)
        expect(result).to.be.equal(true)
    })
    it("Escrow new owner?", async() => {
        let result = await realEstate.ownerOf(1) 
        expect(result).to.be.equal(escrow.address)
    })
    it("Adds the buyers mapping", async() => {
        let result = await escrow.buyer(1) 
        expect(result).to.be.equal(buyer.address)

    }) 
    it("Adds the property price", async() => {
        let result = await escrow.amount(1) 
        expect(result).to.be.equal(tokens(10))
    })
    it("Checks the escrow amount", async() => {
        const transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
        await transaction.wait()
        const result = await escrow.getBalance()
        expect(result).to.be.equal(tokens(5))

    })

})

    describe('Verification', () => {

        it("Check the inspector verification", async() => {
            const transaction = await escrow.connect(inspector).inspectorApprove(1, true)
            await transaction.wait()
            const result = await escrow.inspectorApprovalStatus(1)
            expect(result).to.be.equal(true)
        })

    })
    
    describe('Seller approval', () => {

        it("Checks the seller approval", async() => {
            const transaction = await escrow.connect(seller).sellerApprove(1, true)
            await transaction.wait()
            const result = await escrow.sellersaysyes(1, seller.address)
            console.log(result)

    })


})







})
