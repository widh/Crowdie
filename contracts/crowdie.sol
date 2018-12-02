pragma solidity ^0.5.0;

contract CrowdieFunding {
    
    struct Investor {
        address payable addr;
        uint amount;
    }

    address payable public owner;
    uint public numInvestors;
    uint public deadline;
    string public status;
    string public title;
    string public desc;

    bool public end;
    uint public goalAmount;
    uint public totalAmount;
    uint public _current;
    uint public _starting;
    
    mapping (uint => Investor) public Investors;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    modifier notEnded() {
        require (now <= deadline, "Crowfunding ended.");
        _;
    }
    modifier ended() {
        require (now > deadline, "Crowfunding not ended.");
        _;
    }

    constructor(string memory _title, string memory _desc, uint _duration, uint _goalAmount) public {
        owner = msg.sender;
        _starting = now;
        deadline = _starting + _duration;
        goalAmount = _goalAmount;
        title = _title;
        desc = _desc;
        status = "Funding";
        end = false;
        numInvestors = 0;
        totalAmount = 0;
    }
    
    function fund() payable external notEnded {
        uint xValue = msg.value;
        address payable xSender = msg.sender;
        Investors[numInvestors] = Investor({
            addr: xSender,
            amount: xValue
        });
        numInvestors += 1;
        totalAmount += xValue;
    }

    function checkGoalReached() public onlyOwner ended {
        if(totalAmount >= goalAmount) {
            status = "End_Success";
            end = true;
            require(owner.send(address(this).balance));
        } else {
            status = "End_Failed";
            end = true;
            for(uint i = 0; i < numInvestors; i++) {
                require(Investors[i].addr.send(Investors[i].amount));
            }
        }
    }

}
