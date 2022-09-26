// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract CampaignFactory {
    address[] public deployedCampains;
    
    function createCampaign(uint minimum) public {
        //Campaign campaign = new Campaign(minimum, msg.sender));
        // deployedCampains.push(address(campaign));
        // address a = address(new Campaign(minimum , msg.sender));
        deployedCampains.push(address(new Campaign(minimum , msg.sender)));
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampains;
    }
}

contract Campaign {

    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    // address[] public approvers;
    uint public approversCount = 0;
    uint public totalAmountRised = 0;

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable{
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
        totalAmountRised = address(this).balance;
        // approvers.push(msg.sender);
    }

    function createRequest(string memory description, uint value, address payable recipient) 
        public restricted {

        require(value <= address(this).balance);

        Request storage r = requests.push();
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
        // Request memory newRequest = Request({
        //     description: description,
        //     value: value,
        //     recipient: recipient,
        //     complete: false,
        //     approvalCount: 0
        // });

        // requests.push(newRequest);
        // requests.push(Request({
        //     description: description,
        //     value: value,
        //     recipient: recipient,
        //     complete: false
        // }));
        // requests.push(Request(
        //     description,
        //     value,
        //     recipient,
        //     false
        // ));
    }


    function approveRequest(uint index) public {

        Request storage request = requests[index];

        require(approvers[msg.sender]);
        // require(!requests[index].approvals[msg.sender]);
        require(!request.approvals[msg.sender]);

        // requests[index].approvalCount++;
        // requests[index].approvals[msg.sender] = true;

        request.approvalCount++;
        request.approvals[msg.sender] = true;

    }

    function finalizeRequest(uint index) public restricted {
        
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount/2));
        require(! request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;


    }
}