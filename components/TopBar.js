var fs = require('fs');

class TopBar {
    topBar() {
        return new Promise(resolve => {
            fs.readFile('views/login.html', 'utf8', function(err, data) {
                if(err) {
                    console.log(err);
                }
                console.log('topbar_login');
                resolve(data);
            })
        });
    };
}

module.exports = new TopBar();