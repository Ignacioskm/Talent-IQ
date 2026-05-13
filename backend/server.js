const express = require("express");

const cors = require("cors");

const app = express();



app.use(cors());

app.use(express.json());



app.get("/", (req, res) => {

    res.send("Backend funcionando");
});



app.post("/guardar", (req, res) => {

    console.log("Datos recibidos:");

    console.log(req.body);



    res.json({
        mensaje: "Datos guardados"
    });
});



app.listen(3000, () => {

    console.log("Servidor funcionando en puerto 3000");
});