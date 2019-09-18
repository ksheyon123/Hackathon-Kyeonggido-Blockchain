pragma solidity ^ 0.4 .20;

contract MindHub {
    //구조체 안 변수들의 메모리가 적을수록 Gas비용은 적게 든다.


    /*
    판매자가 구매자에게 배송 신청하고 7일후가 되면 자동으로 배송완료
    uint cooldownTime = 7 days;
    uint32(now + cooldownTime) 
    now + cooldownTime은 현재 유닉스 타임스탬프(초 단위)에 7일을 초 단위로 바꾼 것의 합과 같을 것이네. 
    바꿔 말해 지금부터 하루 뒤의 유닉스 타임스탬프 값과 같은 것이지. 
    이후에 우리는 좀비를 다시 사용하기 위해 충분한 시간이 지났는지 
    확인할 수 있도록 좀비의 readyTime이 now보다 큰지 비교할 것이네.

     function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
    }

    function _isReady(Zombie storage _zombie) internal view returns (bool) {
      return (_zombie.readyTime <= now);
  }

    require(_isReady(myZombie));

    그리고 구매자가 배송 보낸다면 _triggerCooldown(myZombie);


    function getZombiesByOwner(address _owner) external view returns(uint[])
    view함수로 무언가 읽기만 할때 쓴다. gas는 소모되지 않는다.

    //레벨업시 levelUpFee만큼의 이더가 필요하다. 지불이 된다면 레벨업.
    이더를 보내면 바로 보내지 않고 갇히게된다.그래서 출금을해줘야한다.
    function levelUp(uint _zombieId) external payable {
    require(msg.value == levelUpFee);
    zombies[_zombieId].level++;
  }

    이더 트랜스퍼에 관한건 여기 참조
    https://cryptozombies.io/ko/lesson/4/chapter/2
    참고


     */

    /*
    물품 Struct */
    struct Product {
        string product_name;
        uint price;
        uint32 time;
    }
    /*
    판매자 Struct */
    struct Seller {
        address account;
        uint24 sellerNumber;
        string name;
    }

    Product[] public products;
    Seller[] public sellers;

    // //product번호로 판매자가 누구껀지 매핑
    // mapping(uint => address)public productToSeller;
    // //판매자로 판매물품 번호 매핑
    // mapping(address => uint)sellerOwnerCount;

    //product번호로 판매자가 누구껀지 매핑
    //mapping(uint => address)public useridToSeller;
    //판매자로 판매물품 번호 매핑
    mapping(address => Seller)sellerInfo;

    //event evRegisterProduct(uint _id, string _name, uint _price); //물품 등록 Event
    //event evRegisterSeller(uint _id, string _name); //판매자 등록 Event

    // //물품등록
    // function _register_product(string memory _product_name, uint _price)private {
    //     uint id = products.push(Product(_product_name, _price, now)) - 1;
    //     productToSeller[id] = msg.sender;
    //     sellerOwnerCount[msg.sender]++;
    //     evRegisterProduct(id, _product_name, _price);
    // }

    //판매자 등록
    function _register_seller(address memory _account, uint24 memory _sellerNumber, string memory _name) private {
        //uint user_id = sellers.push(Seller(_account, _sellerNumber, _name)) - 1;
        seller.push(Seller(mag.sender, _sellerNumber, _name));
        sellerInfo[msg.sender].account = msg.sender;
        //useridToSeller[user_id] = msg.sender;
        //sellerOwnerCount[msg.sender]++;

        //evRegisterSeller(user_id, _name);
    }

    function _get_seller_info(address memory _account) view retruns (bool) {
        require(condition);
    }
}