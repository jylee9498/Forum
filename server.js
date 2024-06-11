// express 프레임워크를 사용하기 위해 작성해야하는 부분. 우선 시용법을 익히자.
const express = require("express");
const app = express();

// ejs를 사용하기 위해 작성해야하는 부분. 우선 사용법을 익히자. 그리고 ejs 관련 라이브러리를 설치해야한다.(npm install ejs)
app.set("view engine", "ejs");

// method override 사용
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));



// mongo DB를 사용하기 위해서 작성해야하는 부분. 우선 사용법을 익히자.
const { MongoClient,ObjectId } = require('mongodb');
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

// 현재 프로젝트에서는 main.css를 사용하기 위해서 설정하는 부분
app.use(express.static(__dirname + "/public"));


app.get("/", (req,res)=>{
    // 그냥 html 파일을 브라우저에 전달한다.
    res.sendFile(__dirname + "/index.html");
});


app.get("/news", (req,res) =>{
    // collection("post") : post라는 테이블에 접근
    // insertOne{} : post 테이블에 title="어쩌구" 라는 데이터 저장
    db.collection("post").insertOne({title : "어쩌구"});
});

app.get("/about", (req,res) =>{
    // __dirname은 현재 프로젝트 경로임. 거기의 mypage.html을 브라우저에 전달.
    res.sendFile(__dirname+"/mypage.html");
});

app.get("/list", async (req,res) => {

    // collection("post") : post 테이블에 접근
    // find() : post 테이블의 데이터 조회
    // toArray() : 가져온 값을 배열형태로 보여준다.
    let result = await db.collection("post").find().toArray();
    
    //서버가 브라우저에게 list.ejs를 렌더링하여 보내겠다는 의미임.
    res.render("list.ejs", {posts : result});
});

app.get("/time", (req,res) => {
    let time = new Date();
    res.render("time.ejs",{now : time});
});

app.get("/write", (req,res) => {
    res.render("write.ejs");
});

app.post("/add", async (req, res) => {
    try{
        if(req.body.title === ""){
            res.send("title에 입력하지 않았습니다.");
        }else{
        //db에 데이터 저장
       await db.collection("post").insertOne({
            title : req.body.title,
            content : req.body.content,
        });
        res.redirect("/list"); // 특정 url로 이동
        }
    }catch(e){
        console.log(e);
        res.status(500).send("서버 에러 발생.");
    }
});

app.get("/detail/:id", async (req,res) => {
   try{
    console.log(req.params)
    console.log(typeof(req.params))
    let result = await db.collection("post").findOne({
     _id: new ObjectId(req.params.id)
    });
     /* post 테이블의 모든 데이터를 가져온다.
       await db.cection("post").find().toArray();
     */
    console.log(result);
    if (result === null){
        res.status(400).send("잘못된 url 입력했습니다.");
    }
    res.render("detail.ejs",{result:result});
   }catch(e){
    console.log(e);
    res.status(400).send("잘못된 url 입력했습니다.");
   }
});

app.get("/edit/:id", async (req,res) => {
    let result = await db.collection("post").findOne({
        _id : new ObjectId(req.params.id)
    });
    console.log(result)
    res.render("edit.ejs", {result:result});
});

app.put("/edit",  async (req,res) => {
    try {
        if (req.body.title === "" || req.body.content === "") {
            res.send("title 혹은 content의 값이 비었습니다.");
        }
        let result = await db.collection("post").updateOne({ _id: new ObjectId(req.body.id) },
            {
                $set: { title: req.body.title, content: req.body.content }
            });
        console.log(result);
        res.redirect("/list");
    } catch (e) {
        res.status(400).send("잘못된 title 혹은 content 값이 입력되었습니다.");
    }
});

// app.post("/delete", async (req, res) => {
//     console.log(req.body);      // ajax로 데이터를 전송할 때 header, body등으로 데이터를 담아 보낼 때
//     // console.log(req,params); // url에다가 데이터를 담아 보낼 때
//     // console.log(req.query);  // url에 데이터를 담아 보낼 때, 데이터가 여러개 일 때 

//     let result = await db.collection("post").deleteOne(_id = new ObjectId(req.body.id));
// })

app.delete("/delete", async (req, res) => {
    console.log(req.query)
    await db.collection("post").deleteOne({_id:new ObjectId(req.query.docid)});
});