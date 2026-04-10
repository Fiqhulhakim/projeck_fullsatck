const laporan = require("../models/laporanModels")
const { response } = require("express");

class laporanController {
    
    // ambil semua
    index(req, res) {
        laporan.getAll((err, result)=>{
            if(err){
                return res.json({message: "gagal ambil data"});
            }

            res.json({
                message: "berhasil ambil semua data",
                data: result
            });
        });
    }

    // ambil berdasarkan ID
    show(req, res){
        const {id} = req.params;

        laporan.getBYId(id, (err, results)=>{
            if(err){
                return res.json({message: "data tidak ditemukan"});
            }

            res.json({
                message: "detail laporan",
                data : result[0]
            });
        });
    }

    // Menambahkan Laporan
    store(req, res) {
       const  data = req.body;

       laporan.createReport(data, (err)=>{
        if(err){
            return res.json({message: "gagal tambahkan data"});
        }

        res.json({
            message: "data berhasil ditambah",
            data: data
        });
       });
    }

    // Updated Laporan
    update(req, res) {
        const {id} = req.params;
        const data = req.body;

        laporan.update(id,  data, (err)=>{
            if(err){
              return res.json({message: "gagal update data"});      
            }

            res.json({
                message: "data berhasil diupdate"
            });
        });
    }


    // Hapus Laporan
    destroy(req, res) {
        const {id} = req.params;
        
        laporan.deleteReport(id, (err)=>{
            if(err){
                return res.json({message: "gagal hapus data"});
            }

            res.json({
                message: "data berhasil  dihapus"
            });
        });
    }
}

module.exports = new laporanController();