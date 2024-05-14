const express = require("express");
const app = express();

const { MongoClient } = require('mongodb');

 let db;
 const url = "mongodb+srv://admin:1111@cluster0.u7x3pu1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공');
  db = client.db('Cluster0');
  app.listen(8080, () => {
    console.log("http://localhost:8080 에서 서버 실행중");
});

}).catch((err)=>{
  console.log(err);
});

app.use(express.static(__dirname + "/public"));


app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/news", (req,res) =>{
    db.collection("post").insertOne({title : "어쩌구"});
});

app.get("/shop", (req,res) =>{
    res.send("쇼핑페이지 입니다.");
});

app.get("/about", (req,res) =>{
    res.sendFile(__dirname+"/mypage.html");
});