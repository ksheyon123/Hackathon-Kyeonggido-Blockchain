var fs = require('fs');

class Template {
    mainTemplate() {
        return new Promise(resolve => {
            fs.readFile('views/index.html', 'utf8', function(err, data) {
                if(err) {
                    console.log(err);
                }
                console.log('mainTemplate');
                resolve(data);
            });
        });
    };

    topBar() {
        return new Promise(resolve => {
            
        })
    }
}


module.exports = new Template();