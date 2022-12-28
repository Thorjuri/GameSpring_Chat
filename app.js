const express = require("express");
const Http = require("http");
const app = express();
const http = Http.createServer(app);
const port = 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socket = require("./socket");
const Router = require("./routes");
const errorHandlerMiddleware = require("./middlewares/error_handler_middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    cors({
        origin: "*", 
        allowedHeaders: ["content-Type", "Authorization"],
        exposedHeaders: ["content-Type", "Authorization"],
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
        credential: "true",
    })
);

app.options("*", cors());
app.use("/api", Router);
app.use(errorHandlerMiddleware);


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", (req, res) => {
    res.render("login");
}); 
app.get('/signup', (req, res)=> {
    res.render("signup");
});
app.get('/main', (req, res)=> {
    res.render("main");
});
app.get('/friends', (req, res)=> {
    res.render("friends");
});
app.get('/chatroom1', (req, res)=> {
    res.render("chatroom1");
});
app.get('/chatroom2', (req, res)=> {
    res.render("chatroom2");
});

socket(http);

http.listen(port, () => {
    console.log(`${port}번 포트로 서버 실행`);
});
