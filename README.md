<img src="https://user-images.githubusercontent.com/52062612/72350939-b5660800-3722-11ea-9687-ae1f348c713d.jpg" title="Mindhub" alt="Mindhub-Title"></a>

<a href="https://www.youtube.com/watch?v=nsK8G63_SCI&t=17s">***시연영상링크***</a>

### 경기도 블록체인 해커톤, 장려상 수상

# 마인드메이드 : 블록체인을 이용한 핸드메이드/수공예 장터 (2019/08/25 - 2019/09/26)

> '마인드메이드'는 블록체인 기술을 활용해 신뢰 기반 거래 서비스를 제공하고 SmartContract를 통한 중개수수료를 절감으로제품 제작자와 구매자 모두 만족하는 핸드메이드 제품 시장을 지향합니다.

<hr/>

## Overview

'마인드메이드'는 핸드메이드 마켓의 과도한 중개 수수료와 낮은 품질을 블록체인을 통해 해결하고자 합니다. 현재 핸드메이드 제품을 판매하는 방법에는 오프라인 플리마켓, 블로그를 이용한 방법, 거래 중개 플랫폼을 이용한 방법 등이 있습니다. 하지만, 플리마켓은 직접 거리에서 팔아야한다는 불편함, 블로그 마켓은 제품에 대한 검증 불가, 중개 플랫폼은 중개자가 과도한 수수료를 가져가는 문제점을 가지고 있습니다. 저희 '마인드메이드'는 블록체인 기술을 통해 판매자/거래처를 원장에 등록하여 공개하여 신회 기반 거래 서비스를 제공하며 동시에 SmartContract를 활용한 중개 수수료 절감으로 독주 체제인 중개 플랫폼과의 선의의 경쟁을 통해 핸드메이드 제품시장의 발전과 활성화를 이끌고자 합니다.

---

## Service

### '마인드메이드'는 아래의 4가지 서비스를 목표로 개발을 수행합니다.

<img src="https://user-images.githubusercontent.com/52062612/72432978-b018c400-37db-11ea-8493-cfa975e21222.jpg" title="Trucker_Service" alt="Trucker_Service">

### Token Economy
- 구매
  - 물품을 구매하는데 토큰을 이용해 구매한다. 구매 수수료는 없으며 환전시 환전 수수료가 발생한다.

- 광고
  - 판매자는 물품의 판촉을 위해 일정 토큰을 지불하여 광고 배너에 판매 제품을 노출시킬 수 있다.

- 수공예 교육 신청
  - 마인드메이드는 핸드메이드 마켓 활성화를 위해 수공예 교육 프로그램을 제공하며, 수강생들은 일정 토큰을 지불하고 희망 제작자에게 교육을 받게 된다.
 
- 기부
  - 토큰 기부를 통하여 핸드메이드 제품 제작자와 자선단체 및 지역 공동체에 기여한다.

---
## Why Blockchain?
- 제품 정보와 원작자를 블록으로 올림으로써 원작자의 Originality를 보장
- 여러 제품에 대한 평균 시세 확인 (현명한 소비)
- 제품 정보에 대한 투명화
- 신뢰 기반 거래 및 투명성을 제공
- SmartContract를 활용한 P2P거래로 중개 수수료 최소화

## Team

> Or Contributors/People

- 박경재 (팀장)
  - Web Front-End (Bootstrap)
  - Solidity (ERC20)
  
- 강서현
  - Front-End (HTML5, Javascript)
  - Back-End (NodeJS)

- 오현준
  - Front-End (Bootstrap)
  - Solidity

- 김석영
  - Planning
  - Debugging
  
- 함재준
  - Planning
  - Debugging
---

## Tools

- Front-End : 
  - Web (HTML5, Javascript, Bootstrap)

- Back-End : 
  - Server (NodeJS)
  - Solidity

---
## UI
<img src="https://user-images.githubusercontent.com/52062612/72433536-e0149700-37dc-11ea-816a-be759d516af0.jpg" title="Mindmade_Index" alt="Mindmade_Index">

*초기 화면* 

- Index
  - Home
  - Shop
  - Login
  - Register

- Admin
  - Home
  - Shop
  - Token
  - SellerConfirm
  - Myinfo
  - Logout
  
- Seller
  - Home
  - Shop
  - Token
  - ItemUp
  - Myinfo
  - Logout
  
- Buyer
  - Home
  - Shop
  - Token
  - Myinfo
  - Logout

<img src="https://user-images.githubusercontent.com/52062612/72433689-426d9780-37dd-11ea-9b71-d4e6c203e4dd.jpg" title="Mindmade_Token" alt="Mindmade_Token">

*토큰을 구매하는 과정* 

- Admin 계정으로 구매하였으며 이미지와 같이 금액이 추가되는 것을 확인할 수 있다. Register User시 Wallet이 생성되며 Token은 Wallet으로 입금된다.

<img src="https://user-images.githubusercontent.com/52062612/72433747-59ac8500-37dd-11ea-88fd-6fd11b411ca5.jpg" title="Mindmade_Itemup" alt="Mindmade_Itemup">

*Seller의 상품 등록 및 Shop에서 등록된 상품을 확인하는 과정*

- Solidity의 상품 등록 함수로 ProductId가 생성되며 ProductId에 상품에 대한 정보를 담는다.

<img src="https://user-images.githubusercontent.com/52062612/72433777-7052dc00-37dd-11ea-87a2-f8cb0d1ccba9.jpg" title="Mindmade_Details" alt="Mindmade_Details">

*Buyer가 상품 상세 정보를 확인하는 과정*

- 제품의 상세 정보 및 구매를 신청할 수 있으며, 상품 구매를 완료하면 상품평(댓글)을 작성할 수 있다. 또한, Buyer가 구매신청시 PaymentId가 생성된다.

<img src="https://user-images.githubusercontent.com/52062612/72433850-9a0c0300-37dd-11ea-8d0d-93af913b58d1.jpg" title="Mindmade_BuyingList" alt="Mindmade_BuyingList">

*Buyer가 구매를 확정하는 과정*

- PaymentId를 매핑하여 해당 거래를 확정한다.

<img src="https://user-images.githubusercontent.com/52062612/72433819-89f42380-37dd-11ea-95b1-b3f9278b3121.jpg" title="Mindmade_purchase" alt="Mindmade_purchase">

*Buyer와 Seller의 Token 변화*

---
