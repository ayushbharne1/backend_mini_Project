const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))

app.get('/', function(req, res){
    var arr = [];
    fs.readdir('./files',function(err, files){
        files.forEach(function(file){
            var rmtxt = path.parse(file).name;                             //removing .txt 
            var data = fs.readFileSync(`./files/${file}`, "utf-8");
            arr.push({name: rmtxt, details: data})
        })
    res.render("index", {files: arr});

    })
}) 
// read
app.get('/read/:filename', function(req,res){
    const title = req.params.filename+".txt";
    fs.readFile(`./files/${title}`, 'utf-8', function(err, data){
        if(err) return console.log(err);
        res.render('read', {name:req.params.filename, data:data})

    })
})
// delete
app.get('/delete/:filename', function(req,res){
    const title = req.params.filename+".txt";
    fs.unlink(`./files/${title}`, function(err){
        if(err) return console.log(err);
        res.redirect("/");

    })
})

// Update 
app.get('/update/:filename', function(req,res){
    const title = req.params.filename+".txt";
    fs.readFile(`./files/${title}`, 'utf-8', function(err, data){
        if(err) return console.log(err);
        res.render('update', {name:req.params.filename, data:data})
    })
})
app.post('/update/:filename',function(req,res){
    fs.writeFile(`./files/${req.params.filename+ ".txt"}`, req.body.details , function(err,data){
        if(err) return err;
        res.redirect("/");
    })
})


// create
app.post('/create', function(req, res){
    var fname = req.body.name.split(' ').join('') + '.txt';
    fs.writeFile(`./files/${fname}`, req.body.details , function(err,data){
        if(err) return err;
        res.redirect("/");
    })
})

app.listen(3000);