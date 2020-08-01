var express     =require('express'),
    app         =new express(),
    mongooose   =require('mongoose'),
    bodyParser  =require('body-parser'),
    fs          =require('fs'),
    multer      =require('multer'),
    path        =require('path');
require('dotenv').config();    

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//-------------------MONGOOOSSSEEE------------------------------------
var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
var url='mongodb://localhost/imagestoresystem';
mongoose.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true });
var db=mongoose.connection;
db.on('error',console.error.bind(console,'MongoDb connection error'));
mongoose.set('useCreateIndex',true);

var itemSchema=new mongoose.Schema({
    name:String,
    img:String
});
var item=mongoose.model('item',itemSchema);
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/')));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var storage=multer.diskStorage({
    fileFilter: function(req,file,cb){
        if(!file.mimetype.match(/jpg|jpeg|png|gif$i/)){
            cb(new Error('File is not supported'),false)
            return
        }
        cb(null,true);
    }
})
var upload=multer({storage:storage});

const cloudinary=require('cloudinary');
cloudinary.config({
    cloud_name:'hipsicloud',
    api_key:'132221192517858',
    api_secret:'sTC558B7RVN40sFYbVN_26GMWLA'
})









//---------------------------------------------------------------------
app.get('/',(req,res)=>{
    res.render('upload');
})


app.post('/upload',upload.single('image'),async (req,res,next)=>{
    const result=await cloudinary.v2.uploader.upload(req.file.path);  
    item.create({name:req.body.name,img:result['secure_url']},(err,newitem)=>{
        res.render('show',{obj:newitem});
    })   
})

app.get('/photo/:id', (req, res) => {
    var filename = req.params.id;
     
    item.findOne({'_id':filename }, (err, result) => {
     
        if (err) return console.log(err)
     
       res.contentType('image/jpeg');
       res.send(result.image.buffer)
       
        
      })
    })









//---------------------------------------------------------------    
app.listen(3000,()=>{
    console.log("Server started");
})