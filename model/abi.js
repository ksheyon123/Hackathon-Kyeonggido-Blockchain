var Web3 = require("web3");
var web3 = new Web3();

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_payId",
				"type": "uint256"
			}
		],
		"name": "_adobt",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_payId",
				"type": "uint256"
			}
		],
		"name": "_auto_confirm",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_payId",
				"type": "uint256"
			}
		],
		"name": "_purchase_confirmation",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_buyerAddress",
				"type": "address"
			},
			{
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "_purchase_product",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_sellerAddress",
				"type": "address"
			},
			{
				"name": "_product_name",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "_register_product",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "_register_seller",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_buyerAddress",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "_token_purchase",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_mindTokenContract",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtPurchaseProduct",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtPurchaseConfirmation",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtAdobt",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtAutoConfirm",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtRegisterSeller",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtRegisterProduct",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_buyerAddress",
				"type": "address"
			}
		],
		"name": "_get_ablebalance",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "_get_balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_get_payment_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_get_product_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddr = '0x81387D012eB7A765D92cf4B16ee0D45f4e6eCE52';
const myContract = new web3.eth.Contract(abi, contractAddr);

module.exports = { myContract, web3 };
