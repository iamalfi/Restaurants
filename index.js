const express = require("express");

const mongoose = require("mongoose");
const app = express();
const {
    createReastaurant,
    getByQuery,
    updateRestaurant,
    deleteRestaurant,
} = require("./controller/restaurant");

app.use(express.json());

mongoose
    .connect(
        "mongodb+srv://Alfiya:Alfiya%40123@cluster0.gc3lqdx.mongodb.net/?retryWrites=true&w=majority",
        { dbName: "Restaurant" },
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err));

app.post("/create", createReastaurant);
app.delete("/delete/:id", deleteRestaurant);
app.put("/update/:id", updateRestaurant);
app.get("/restaurants", getByQuery);
app.listen(3000, function () {
    console.log("Express app running on port" + 3000);
});
