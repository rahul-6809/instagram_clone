const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routeHandler = require("./Routes/routes");
const { PORT, MONGOOSE_CONNECTION } = require("./config");
const cors = require("cors");
const path =require("path");

app.use(express.json());

app.use(cors());

app.use("/", routeHandler); 

mongoose
  .connect(MONGOOSE_CONNECTION, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDb Connected.....");
  })
  .catch((err) => {
    console.log(err.message);
  });



  app.use(express.static(path.join(__dirname,'../frontent/build')));

  app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,'../frontent/build/index.html'),
    (err) =>{res.status(500).send(err)});
  })



app.listen(PORT || process.env.PORT, () => {
  console.log("Server is Running on:", PORT||process.env.PORT);
});
