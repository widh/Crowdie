pragma solidity ^0.4.18;
contract CrowdFunding {
// Investor struct
struct Investor {
address addr; // investor's address
uint amount; // investment amount
}
address public owner;
uint public numInvestors;
uint public deadline;
string public status;

bool public end;
uint public goalAmount;
uint public totalAmount;
uint public _current;
uint public _starting;
mapping (uint => Investor) public Investors;
modifier onlyOwner () {
require(msg.sender == owner, "Not owner");
_;
}
modifier notEnded () {
require (!end, "Crowfunding ended.");
_;
}
modifier deadlineReached () {
require (now >= deadline, "Crowfunding still running.");
_;
}
constructor(uint _duration, uint _goalAmount) public {
owner = msg.sender;
_starting = now;
deadline = _starting + _duration;
goalAmount = _goalAmount;
status = "Funding";
end = false;
numInvestors = 0;
totalAmount = 0;
}
function fund() public payable notEnded {
Investor storage inv = Investors[numInvestors++];
inv.addr = msg.sender;
inv.amount = msg.value;
totalAmount += inv.amount;
}
function checkGoalReached () public onlyOwner notEnded deadlineRea
ched {
if(totalAmount >= goalAmount) {
status = "Campaign Success";
end = true;
require(owner.send(address(this).balance), "Not able to send f
unds to owner.");
return;
}
status = "Campaign Failed";
end = true;
for(uint i = 0; i <= numInvestors; i++) {
require(Investors[i].addr.send(Investors[i].amount));
}
}
function kill() public onlyOwner {
selfdestruct(owner);
}
}
