//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

// Create the Escrow smart contract. This lists the new properties and assigns the necessary third parties.

contract Escrow {

    modifier onlySeller() {
       require(msg.sender == seller,"only seller can call method");
        _;
    }

    modifier onlyBuyer(uint256 _nftId) {
        require(msg.sender == buyer[_nftId],"only buyer can call method");
        _;
    }

    modifier onlyInspector(uint256 _nftId) {
        require(msg.sender == inspector,"only buyer can call method");
        _;
    }

// Add mappings for price, buyer id and escrow amount
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => uint256) public amount;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => bool) public inspectorApprovalStatus;
    mapping(uint256 => mapping(address => bool)) public generalApproval;
    mapping(uint256 => mapping(address => bool)) public sellersaysyes;


// Define the third parties
    address payable public seller;
    address public inspector;
    address public lender;
    address public nftAddress;
    address public buyeraddress;



    constructor(address payable _seller, address _inspector, address _lender, address _nftAddress){

        seller = _seller;
        inspector = _inspector;
        lender = _lender;
        nftAddress = _nftAddress;

    }

// List new properties
    function list(uint256 _nftId, address _buyer, uint256 _amount, uint256 _escrowAmount) public payable onlySeller(){
        // Incorporate filling in of other mappings

        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
        isListed[_nftId] = true;
        buyer[_nftId] = _buyer;
        amount[_nftId] = _amount;
        escrowAmount[_nftId] = _escrowAmount;
    }

    function depositEarnest(uint256 _nftId) public payable onlyBuyer(_nftId) {
        require(escrowAmount[_nftId] <= msg.value);
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function inspectorApprove(uint256 _nftId, bool _status) public onlyInspector(_nftId) {
        inspectorApprovalStatus[_nftId] = _status;
    }

    function generalApprove(uint256 _nftId, bool _approval) public {
        generalApproval[_nftId][msg.sender] = _approval;
    }
    function approveSale(uint256 _nftID) public {
        generalApproval[_nftID][msg.sender] = true;
    }

    function sellerApprove(uint256 _nftId, bool _approval) public {
        sellersaysyes[_nftId][msg.sender] = _approval;

    }
}


