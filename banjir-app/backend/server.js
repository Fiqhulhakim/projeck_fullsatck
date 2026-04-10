// Import Express
const Express = require("express");
const router = require("./routes/api");
const db = require("./config/database");

// Membuat object express
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded());
app.use(router);

// test database
app.get("/test-db", (req ,res) => {
    db.query("select 1", (err, result) =>{
        if(err) {
            res.json({ message: "koneksi database gagal"});
        } else {
            res.json({
                message: "koneksi database berhasil",
                result: result
            });
        }
    });
});

// pindahkan routing ke routes/api.js
app.listen(3000, ()=>{
    console.log("server berjalan di port 3000");
});