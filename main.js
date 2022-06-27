const express = require("express");
const app = express();

//DOTENV
require("dotenv").config();
const port = process.env.PORT ;

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const fs = require('fs')
const path = require("path");
const moment = require("moment");

//ejs
app.set('view engine', 'ejs');

//arquivos estáticos
app.use(express.static("public"));

// MULTER
const multer = require("multer");
// console.log(multer);


const storage = multer.diskStorage({
    destination: async (req, file, cb)=>{

        var data = moment().format("DD/MM/YYYY").toString();
        // data = data.replace("/\\/gi","");
        data = data.replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/gi, '').replace(/ /g, "");//DEIXA APENAS NUMEROS E LETRAS - E DEPOIS REITRA OS ESPAÇO EM BRANCO   
        //O NOME DA PASTA DO DIA SERÁ O DIA MES ANO MAIS PASTA
        const fs = require('fs');
        const dir = __dirname+"/uploads"+data;
        console.log(dir);

        //Verifica se não existe
        if (!fs.existsSync(dir)){
        //Efetua a criação do diretório
        fs.mkdirSync(dir);
        }

         cb(null, dir);
         //  cb(null,  __dirname+'/'+ Date.now()+'/uploads/');
    },
    filename:  async (req, file, cb)=>{
        var data = moment().format("DD/MM/YYYY hh:mm:ss").toString();
        // data = data.replace("/\\/gi","");
        data = data.replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/gi, '').replace(/ /g, "");//DEIXA APENAS NUMEROS E LETRAS - E DEPOIS REITRA OS ESPAÇO EM BRANCO   
        cb(null, data+'-'+file.originalname);
    }
});
const upload = multer({storage});//diretório onde será salvo os arquivos


//para disponibilizar o file para download





app.get("/home", (req,res)=>{
    res.render("index.ejs");
});


app.post("/files", upload.array("files"), (req,res)=>{
    console.log({body:req.body});
    
    for(let file of req.files){
    console.log({files:file}); 
    }

    res.render("index.ejs");

});



app.post('/download', async function(req, res){

  try{

  const path = require('path');
  const mime = require('mime');
  const fs = require('fs');   

  var file = __dirname + '/uploads/'+req.body.nome;

  var filename = path.basename(file);
  var mimetype = mime.getType(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream =  fs.createReadStream(file);
  filestream.pipe(res);
}
    
  catch(err){
    console.log(err);
    res.json({msg:"Houve algum erro com o aplicativo!"});
  }

});




app.use(function(req, res, next) {
    res.status(404).render("erro404.ejs");
});

app.listen(parseInt(port), ()=>{
    console.log("APP no ar na porta "+port);
});