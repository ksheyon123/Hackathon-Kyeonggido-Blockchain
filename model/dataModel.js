var myConnection = require('../dbConfig');


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
                const sql = 'INSERT INTO item (user, item_name, item_category, item_price, item_img, item_info) values (?, ?, ?, ?, ?, ?)';
                try {
                    var result = await myConnection.query(sql, [data.user, data.item_name, data.item_category, data.item_price, data.item_img, data.item_info]);
                    resolve('hi');
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
        return new Promise (
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
        return new Promise (
            async (resolve, reject) => {
                const sql = 'SELECT item_img, item_name, item_price, item_code FROM item ORDER BY item_rank DESC limit 0,3;';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result[0]);
                } catch(err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new Item();