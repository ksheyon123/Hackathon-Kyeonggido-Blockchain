var item_conn = require('../itemConfig');
var inc_conn = require('../incConfig')

class Item {

    itemup(req) {
        var data = {
            userID: req.body.user,
            item_name: req.body.item_name,
            item_category: req.body.item_category,
            item_price: req.body.item_price,
            item_img: req.body.item_img,
            item_info: req.body.item_info
        }
        return new Promise(
            async (resolve, reject) => {
                const sql = 'INSERT INTO item (user, item_name, item_category, item_price, item_img, item_info) values (?, ?, ?, ?, ?, ?)';
                try {
                    var result = await item_conn.query(sql, [data.userID, data.item_name, data.item_category, data.item_price, data.item_img, data.item_info]);
                    resolve('hi');
                } catch (err) {
                    reject(err);
                }

            }
        )
    }


    selectAllItem() {
        return new Promise(
            async (resolve, reject) => {
                const sql = 'SELECT * FROM item';
                try {
                    var result = await item_conn.query(sql);
                    resolve(result)
                } catch(err) { 
                    reject(err);
                }
            }
        )
    }

    // sellerData() {
    //     return new Promise(
    //         async (resolve, reject) => {
    //             const sql = 'SELECT * FROM seller'
    //             try {

    //             } catch (err) {

    //             }
    //         }
    //     )
    // }

}

module.exports = new Item();