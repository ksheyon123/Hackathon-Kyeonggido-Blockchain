pragma solidity ^0.5.0;

import "./MindToken.sol";

contract MindHub {
    
    MindToken private mindTokenContract;
    address payable private deployer;

    /*
    배송 상태 {구매완료, 배송중, 배송완료, 구매확정, 완료}
    */
    enum State { PurchaseCompletion, 
    Shipping, 
    DeliveryComplete, 
    PurchaseConfirmation, 
    Completion, 
    Cancel }

    /*
    물품 Struct 
    name 물품이름
    price 가격
    seller_owner 물품 주인
    */
    struct Product {
        string name;
        uint price;
        address payable seller_owner;
    }

    /*
    사용자 Struct 
    account 사용자 계좌
    paymentArray 결제내역
    productArray 물품내역
    isSeller 판매자가 등록여부
    */
    struct User {
        address account;
        uint ableBalance;
        uint[] paymentArray;
        uint[] productArray;
        bool isSeller;
    }

    /*
    결제 Struct 
    price 토큰 가격
    deliveryTime 배송날짜
    sellerAddress 판매자 계좌주소
    buyerAddress 구매자 계좌주소
    state 배송상태
    */
    struct Payment {
        uint price;
        uint deliveryTime;
        address payable sellerAddress;
        address payable buyerAddress;
        State state;
    }

    uint private productId; //물품 번호
    uint private paymentId; //결제 번호
    uint private officialDelveryTime = 30; //배송확정 지연시간 (30초)

    mapping(address => User) userList;
    mapping(uint => Payment) payList;
    mapping(uint => Product) productList;

    
    constructor(MindToken _mindTokenContract) public {
        mindTokenContract = _mindTokenContract;
        deployer = msg.sender;
        productId = 0;
        paymentId = 0;
    }

     event evtPurchaseProduct();
     event evtPurchaseConfirmation();
     event evtAdobt();
     event evtAutoConfirm();
     event evtRegisterSeller();
     event evtRegisterProduct();

    
    //오직 판매자만 접근하는 모디파이어
    modifier onlySeller(address _address) {
        require(userList[_address].isSeller == true);
        _;
    }
    
    //구매를 했는지 확인하는 모디파이어
    modifier isPurchaseCompletion(State state) {
        require( state == State.PurchaseCompletion );
        _;
    }

    //결제 내역 갯수가 초과를 했는가?
    modifier isOverPayment(uint _payCount) {
        require( _payCount <= _get_payment_count() );
        _;
    }

    //결제 내역 갯수가 초과를 했는가?
    modifier isZeroId(uint _id) {
        require( _id != 0 );
        _;
    }
    
    /*
    ============================구매부분================================
    */
    //물품 구매
    function _purchase_product(address payable _buyerAddress, uint _productId) public payable {
        require(_productId <= _get_product_count());
        require(userList[_buyerAddress].ableBalance >= userList[_buyerAddress].ableBalance - productList[_productId].price);
        require( (userList[_buyerAddress].ableBalance - productList[_productId].price) >= 0 );
        userList[_buyerAddress].paymentArray.push(paymentId);
        payList[paymentId].price = productList[_productId].price;
        payList[paymentId].sellerAddress = productList[_productId].seller_owner;
        payList[paymentId].buyerAddress = _buyerAddress;
        payList[paymentId].state = State.PurchaseCompletion;
        payList[paymentId].deliveryTime = now + officialDelveryTime;

        //토큰으로 구매하는 부분
        mindTokenContract.approve(_buyerAddress, _buyerAddress, 0);
        mindTokenContract.increaseAllowance(_buyerAddress, _buyerAddress, productList[_productId].price);
        
        userList[_buyerAddress].ableBalance -= productList[_productId].price;

        _add_payid();
        emit evtPurchaseProduct();
    }

    function _add_payid() private {
        paymentId++;
    }
    //결제내역 갯수 불러오기
    function _get_payment_count() view public isZeroId(productId) returns (uint) { 
        return paymentId-1;
    }
    
    //물품 구매 확정 (배송완료)
    function _purchase_confirmation(uint _payId) public 
    isPurchaseCompletion(payList[_payId].state) isOverPayment(_payId) {
        mindTokenContract.transferFrom(payList[_payId].buyerAddress, payList[_payId].buyerAddress, 
        payList[_payId].sellerAddress, payList[_payId].price);
        payList[_payId].state = State.Completion;
        emit evtPurchaseConfirmation();
    }
    
    //물품 결제 취소 (결제취소)
    function _adobt(uint _payId) public 
    isPurchaseCompletion(payList[_payId].state) isOverPayment(_payId) {
        payList[_payId].state = State.Cancel;
        userList[payList[_payId].buyerAddress].ableBalance += payList[_payId].price;
        emit evtAdobt();
    }
    
    //물품 강제 배송확정 (30초후)
    function _auto_confirm(uint _payId) public {
        require(now >= payList[_payId].deliveryTime);
        _purchase_confirmation(_payId);
        emit evtAutoConfirm();
    }


    /*
    ============================판매자 등록================================
    */
    function _register_seller(address _address) public {
        userList[_address].isSeller = true;
        emit evtRegisterSeller();
    }
    
    //판매자 정보 불러오기
    // function _get_seller_info(address _account) view public returns  (address) {
    //     return (userList[_account].account);
    // }
    
    //물품 갯수 불러오기
    function _get_product_count() view public isZeroId(productId) returns (uint)  { 
        return productId-1;
    }
    

    /*
    ============================물품 등록================================
    */
    //판매 물품 등록
    function _register_product(address payable _sellerAddress, string memory _product_name, uint _price) public onlySeller(_sellerAddress) {
        userList[_sellerAddress].productArray.push(productId);
        productList[productId].name = _product_name;
        productList[productId].price = _price;
        productList[productId].seller_owner = _sellerAddress;
        _add_productid();
        emit evtRegisterProduct();
    }

    function _add_productid() private {
        productId++;
    }
    
    
    /*
    ===========================토큰 구매 부분============================
    */
    //토큰 구매
    //web에서 현금만큼만 구매할 수 있도록 제어 해줘야함.
    function _token_purchase(address _buyerAddress, uint _value) public {
        mindTokenContract.approve(deployer, _buyerAddress, _value);
        mindTokenContract.transferFrom(deployer, _buyerAddress, _buyerAddress, _value);
        userList[_buyerAddress].ableBalance += _value;
    }


    /*
    ===========================Balance get ============================
    */
    function _get_ablebalance(address _buyerAddress) public view returns (uint balance) {
        return userList[_buyerAddress].ableBalance;
    }

    //Real Balance get
    function _get_balanceOf(address _address) public view returns (uint balance) {
        return mindTokenContract.balanceOf(_address);
    }
    
}
