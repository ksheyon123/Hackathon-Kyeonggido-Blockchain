var myConnection = require('../dbConfig');
var Web3 = require("web3");
var web3 = new Web3();
var myContract = require('./abi');

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
        console.log(data.user);
        return new Promise(
            async (resolve, reject) => {
                try {
                    //item_code ++1;
                    const sql = 'SELECT MAX(item_code) AS result FROM item';
                    var result = await myConnection.query(sql);
                    if (!result[0][0].result) {
                        var item_code = 0;
                    } else {
                        console.log(result[0][0].result);
                        var item_code = result[0][0].result + 1;
                    }
                    try {
                        const sql = 'INSERT INTO item (user, item_name, item_category, item_price, item_img, item_info,item_code) values (?, ?, ?, ?, ?, ?, ?)';
                        var result = await myConnection.query(sql, [data.user, data.item_name, data.item_category, data.item_price, data.item_img, data.item_info, item_code]);
                        resolve('hi');
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
                const sql = 'SELECT status FROM solditem WHERE item_code = ? AND user = ?';
                try {
                    var result = await myConnection.query(sql, [data.itemCode, data.userID]);
                    console.log(result);
                    if(result[0][0]) {
                        resolve(0);
                    } else {
                        resolve(1);
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
                const sql = 'INSERT INTO (buyer, comment, item_code, selectoption) values (?, ?, ?, ?)';
                try {
                    await myConnection.query(sql, [data.userData, data.textarea, data.itemCode, data.itemData]);
                    resolve(data.itemData);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

}

module.exports = new Item();