const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const port = process.env.PORT || 4008;

// routers handle here
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// to handle static files
app.use(express.static(path.join(__dirname, "public")));

// router call here
app.use("/user", userRouter);
app.use("/product", productRouter);

app.listen(port, () => {
  console.log(`server start on port : ${port} successfully`);
});
