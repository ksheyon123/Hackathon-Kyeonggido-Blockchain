import "./MindToken.sol";

contract tokentset {
        
    MindToken public mindTokenContract;
    address payable public sender;
    uint price = 0;
    uint realBalance = 0;
    
    constructor(MindToken _mindTokenContract) public {
        mindTokenContract = _mindTokenContract;
        sender = msg.sender;
        uint pay = mindTokenContract.allowance(msg.sender, msg.sender);
        realBalance = (mindTokenContract.balanceOf(msg.sender) - pay);
    }
    
    function token_purchase(uint _value) public {
        mindTokenContract.approve(sender, msg.sender, _value);
        mindTokenContract.transferFrom(sender, msg.sender, msg.sender, _value);
    }
    
    function confirm(address _address) public {
        uint pay = mindTokenContract.allowance(msg.sender, msg.sender);
        mindTokenContract.transferFrom(msg.sender, msg.sender, _address, pay);
    }
    
    function purchase(uint _price) public {
        price = _price;
        mindTokenContract.approve(msg.sender, msg.sender, 0);
        mindTokenContract.increaseAllowance(msg.sender, msg.sender, price);
        uint pay = mindTokenContract.allowance(msg.sender, msg.sender);
        realBalance = (mindTokenContract.balanceOf(msg.sender) - pay);
    }
    
    function get_realBalance() public view returns (uint) {
        uint pay = mindTokenContract.allowance(msg.sender, msg.sender);
        return (mindTokenContract.balanceOf(msg.sender) - pay);
    }
}