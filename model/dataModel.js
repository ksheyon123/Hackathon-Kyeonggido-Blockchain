var myConnection = require('../categoryConfig');

var userModel = require('../model/userModel');
var dataModel = require('../model/dataModel');

class Item {
    selectAll() {
        return new Promise( 
            async (resolve, reject) => {
                const sql = 'SELECT * FROM kyeonggidb';
                try {
                    var result = await myConnection.query(sql);
                    resolve(result);
                } catch(err) {
                    reject(err);
                }
            }
        )
    }
    
    
}

module.exports = new Item();