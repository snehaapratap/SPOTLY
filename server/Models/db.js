const mongoose = require("mongoose");

const mongo_url = "mongodb+srv://rahultest:Lonewolf@cluster0.8vi2o.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err);
  });
