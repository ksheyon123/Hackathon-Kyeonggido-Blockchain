pragma solidity ^0.5.0;


contract purtest {
    
    enum State { Purchase, Confirm, Adbot, Finish }
    
    struct Product {
        string name;
        uint price;
        address payable owner;
    }

    struct Seller {
        address account;
        uint[] paymentArray;
        uint[] products;
    }
    struct Buyer {
        address account;
        uint[] paymentArray;
    }
    struct Payment {
        uint paymentId;
        uint price;
        uint deliveryTime;
        address payable seller_payment;
        address payable buyer_payment;
        State state;
    }

    mapping(address => Buyer) buyerlist;
    mapping(address => Seller) sellerlist;
    mapping(uint => Payment) paylist;
    mapping(uint => Product) productlist;
    
    uint price = 0;
    address payable seller;
    uint public seq = 0;
    uint public productSeq = 0;
    
    uint private officialDelveryTime = 30;
    
    constructor() public payable{
        seller = msg.sender;
    }
    
    
    function _purchase_product(uint _productId) public payable {
        require(productlist[_productId].price == msg.value);
        buyerlist[msg.sender].paymentArray.push(seq);
        paylist[seq].paymentId = seq;
        paylist[seq].price = msg.value;
        paylist[seq].seller_payment = productlist[_productId].owner;
        paylist[seq].buyer_payment = msg.sender;
        paylist[seq].state = State.Purchase;
        paylist[seq].deliveryTime = now + officialDelveryTime;
        seq++;
    }
    
    function _confirm(uint _seq, uint _productId) public {
        require(msg.sender == paylist[_seq].buyer_payment);
        require(productlist[_productId].owner == paylist[_seq].seller_payment);
        require(paylist[_seq].state == State.Purchase);
        seller.transfer(paylist[_seq].price);
        paylist[_seq].state = State.Finish;
    }
    
    function _adobt(uint _seq) public {
        require(msg.sender == paylist[_seq].buyer_payment);
        require(paylist[_seq].state == State.Purchase);
        paylist[_seq].buyer_payment.transfer(paylist[_seq].price);
        paylist[_seq].state = State.Finish;
    }
    
    function _auto_confirm(uint _seq, uint _productId) public {
        require(now >= paylist[_seq].deliveryTime);
        _confirm(_seq, _productId);
    }
    
    function set(uint _value, string memory _name) public {
        sellerlist[msg.sender].products.push(productSeq);
        productlist[productSeq].name = _name;
        productlist[productSeq].price = _value;
        //price = _value;
        productSeq++;
    }
}