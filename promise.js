function getData() {
    return new Promise(function (resolve, reject) {
      var data = 100;
      resolve(data);
    });
  }
  
  // resolve()의 결과 값 data를 resolvedData로 받음
  getData().then(function (resolvedData) {
    console.log(resolvedData); // 100
  });