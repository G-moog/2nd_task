const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");
const Texts = require("./models/texts");
const Writes = require("./models/write");

mongoose.connect("mongodb://localhost/shopping-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();


// 회원가입하기
router.post("/users", async (req, res) => {
    const {nickname, password, confirmPassword} = req.body;

    if(password !== confirmPassword){
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.', 
        });
        return;
    }

    const existUsers = await User.findOne({
        $or: [{nickname}],
    });
    if(existUsers){
        res.status(400).send({
            errorMessage: '이미 가입된 닉네임이 있습니다.',
        });
        return;
    }

    const user = new User({nickname, password});
    await user.save();

    res.status(201).send({});
});

// 로그인하기
router.post("/auth", async (req, res) => {
    const { nickname, password } = req.body;
  
    const user = await User.findOne({ nickname });
  
    if (!user || password !== user.password) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
      });
      return;
    }
  
    res.send({
      token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    });
  });

router.get("/users/me", authMiddleware,  async (req, res) => {
    const { user } = res.locals;
    res.send({
        user,
    });
});  


// 모든 게시글 가져오기
router.get("/texts", authMiddleware, async (req, res) => {
    const texts = await Texts.find().exec();
  
    res.send({ texts });
    console.log('게시글 목록을 보냈습니다.')
  });

// 게시글 하나만 불러오기
  router.get("/texts/:textsId", authMiddleware, async (req, res) => {
    const { textsId } = req.params;
    const texts = await Texts.findById(textsId).exec();
  
    if (!texts) {
      res.status(404).send({});
    } else {
      res.send({ texts });
    }
  });  

// //   게시글 작성하기
//   router.post("/write", async (req, res) => {
// 	const { title, nickname, content } = req.body;

//     const createdTexts = await Write.create({ title, nickname, content });

//   res.json({ texts: createdTexts });
// });

// 게시글 작성하기
router.post("/write", async (req, res) => {
    const {title, nickname, content} = req.body;


    
    const write = new Texts({title, nickname, content});
    await write.save();

    const result = await write.save();
    console.log(result);

    res.status(201).send({});
    
});

  


app.use(express.json());
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});