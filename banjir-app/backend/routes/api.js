const laporanController = require("../controllers/laporanController");

const express = require("express")
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("haiiiii");
});


// routing laporan
router.get("/laporan", laporanController.index);
router.post("/laporan", laporanController.store);
router.put("/laporan/:id", laporanController.update);
router.delete("/laporan/:id", laporanController.destroy);

module.exports = router;