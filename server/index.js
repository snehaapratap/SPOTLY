const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const path = require("path");

require("dotenv").config();
require("./Models/db");
const PORT = process.env.PORT || 8080;

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(bodyParser.json());
app.use(
  cors({
    origin:["https://star-light-web-dev-kbea.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);

if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static(path.join(dirPath)));
}

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
