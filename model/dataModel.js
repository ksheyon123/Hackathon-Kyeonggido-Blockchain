var myConnection = require('../dbConfig');
// var Web3 = require("web3");
// var web3 = new Web3();
var Contract = require('./abi');
var myContract = Contract.myContract;
var web3 = Contract.web3;

web3.setProvider(
    new web3.providers.HttpProvider('http://localhost:7545')
);

class Item {
    itemup(req) {
        var data = {
            user: req.body.user,
            item_name: req.body.item_name,
            item_category: req.body.item_category,
            item_price: req.body.item_price,
            item_img: req.body.item_img,
            item_info: req.body.item_info
        }
        console.log('seller info', req.session.user);
        console.log('user', data.user);
        return new Promise(
            async (resolve, reject) => {
                try {
                    //item_code ++1;

                    const sql = 'SELECT MAX(item_code) AS result FROM item';
                    var result = await myConnection.query(sql);
                    console.log('Maxitemcode', result);
                    if (result[0][0].result == null) {
                        var item_code = 0;
                    } else {
                        console.log('if item exist', result[0][0].result);
                        var item_code = result[0][0].result + 1;
                    }
                    try {
                        const sql = 'INSERT INTO item (user, item_name, item_category, item_price, item_img, item_info,item_code) values (?, ?, ?, ?, ?, ?, ?)';
                        await myConnection.query(sql, [data.user, data.item_name, data.item_category, data.item_price, data.item_img, data.item_info, item_code]);
                        //itemUp 
                        console.log('itemupwallet', req.session.user.userWallet);
                        await myContract.methods._register_product(req.session.user.userWallet, data.item_name, parseInt(data.item_price))
                            .send({ from: '0x3b8886c692611ae5113d8ba5dec7392d839ab3b9', gas: 3000000 });
                        resolve('kyeongJae');
                    } catch (err) {
                        reject(err);
                    }
                } catch (err) {
                    reject(err);
                }

            }
        )
    }

    itemEdit(data) {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'UPDATE ';
                try {

                } catch (err) {

                }
            }
        )
    }


    selectAllItem() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM item';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    categorySelect() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM category';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    matchcategory(req) {
        return new Promise(
            async (resolve, reject) => {
                var data = req.body.category;
                const sql = 'SELECT * FROM item WHERE item_category = ?';
                try {
                    var result = await myConnection.query(sql, data);
                    resolve(result);
                } catch (err) {
                    reject('matchcategory Err');
                }
            }
        )
    }

    selectAllItemBasedOnUserId(data) {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM item WHERE user = ?';
                try {
                    var result = await myConnection.query(sql, data);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    selectAllItemBasedOnItemCode(data) {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM item WHERE item_code = ?';
                try {
                    var result = await myConnection.query(sql, [data]);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    // SELECT TOP 3 Item Based On item_rank
    selectTop3Item() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT item_img, item_name, item_price, item_code FROM item ORDER BY item_rank DESC limit 0,3;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    // SELECT TOP 8 Item Based On item_rank
    selectTop8Item() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT item_img, item_name, item_price, item_code FROM item ORDER BY item_rank DESC limit 0,8;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    // SELECT RECEENT Rsegister 8 Item Based On item_code
    selectRecentProductItem() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT item_img, item_name, item_price, item_code FROM item ORDER BY item_code DESC limit 8;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    // SELECT Low Price 8 Item Based On item_code
    selectlowPriceItem() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT item_img, item_name, item_price, item_code FROM item ORDER BY item_price ASC limit 8;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    // SELECT Best Item Based On item_code
    selectBestTopItem() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT item_img, item_name, item_price, item_code FROM item ORDER BY item_rank DESC limit 1;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    // SELECT Best Item Based On item_code
    selectRecentSellerInc() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT id, user, inc_name, inc_address, inc_info FROM inc ORDER BY id DESC limit 3;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    //Select All Comment Data From Comment Table
    selectAllComment(data) {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM comment WHERE item_code = ?';
                try {
                    var comment = await myConnection.query(sql, [data]);
                    resolve(comment[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    showSolditemStatus(data) {
        console.log('dataModel', data);
        return new Promise(
            async (resolve, reject) => {
                try {
                    const sql = 'SELECT status FROM solditem WHERE item_code = ? AND user = ?';
                    var result = await myConnection.query(sql, [data.itemCode, data.userID]);
                    console.log('status', result[0][0]);
                    if (!result[0][0]) {
                        resolve(result[0][0]);
                    } else {
                        console.log('dataModel Status : ', result[0][0].status);
                        resolve(result[0][0].status);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    insertComment(data) {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'INSERT INTO comment (buyer, comment, item_code, selectoption) values (?, ?, ?, ?)';
                try {
                    console.log(data);
                    await myConnection.query(sql, [data.userData, data.textarea, data.itemCode, data.itemData]);
                    resolve(0);
                } catch (err) {
                    reject(1);
                }
            }
        )
    }
    changeSoldItemStatustoOne(data) {
        return new Promise(
            async (resolve, reject) => {
                console.log('changeSoldItemStatus Data : ', data);
                const sql = 'UPDATE solditem SET status = 1 WHERE user = ? AND item_code = ?';
                try {
                    await myConnection.query(sql, [data.userData, data.itemCode]);
                    resolve(0);
                } catch (err) {
                    reject('changeSoldItemStatus Err : ', err);
                }
            }
        )
    }
    changeSoldItemStatustoTwo(data) {
        return new Promise(
            async (resolve, reject) => {
                console.log('changeSoldItemStatus Data : ', data);
                const sql = 'UPDATE solditem SET status = 2 WHERE id = ?';
                try {
                    await myConnection.query(sql, [data.data]);
                    resolve(0);
                } catch (err) {
                    reject('changeSoldItemStatus Err : ', err);
                }
            }
        )
    }



    deleteItemFromSolditem(data) {
        return new Promise(
            async (resolve, reject) => {
                console.log('id : ' + data.data + ' deleting');
                const sql = 'DELETE FROM solditem WHERE id = ?';
                try {
                    await myConnection.query(sql, [data.data]);
                    resolve('Delete Complete');
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    UpItemRank(data) {
        return new Promise(
            async (resolve, reject) => {
                console.log('UpItemRank');
                const sql = 'UPDATE item SET item_rank = item_rank + 1 WHERE id = ?';
                try {
                    await myConnection.query(sql, [data]);
                    resolve(0);
                } catch (err) {
                    reject('UpItemRank Err ', err);
                }
            }
        )
    }

}

module.exports = new Item();