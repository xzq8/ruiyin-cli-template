var client = require('scp2');
console.log("uploading ~~~~~~  wait")
client.scp("./build/", // 需要上传的目录
{
    host: '47.100.233.72',
    username: 'root',
    password: 'fqjP@o3F&!Q!dZUiesa',
    path: '/home/ruiyin/opt/static/BookGYM'
},function(err){
    if(err){
        console.log(err)
    }else{
        console.log("upload finish , successful azhen")
    }
})