const express = require('express');
const router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');
const multer = require('multer');
const carModel = require('./car')

passport.use(new localStrategy(userModel.authenticate()));



var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null,'./public/images/uploads')
  },
  filename: function (req, file, cb) {
    var randomNumber = Math.floor(Math.random() * 100000000)
    randomNumber = randomNumber + Date.now();
    var uniqueNaam = randomNumber + file.originalname;
    cb(null, uniqueNaam)
  }
})
 
var upload = multer({ storage: storage , fileFilter: fileFilterFnc})

function fileFilterFnc(req, file, cb){
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') cb(null, true)
  else cb(null , false)
  
}

router.get('/', redirecttoprofile, function(req, res, ) {
  res.render('index' ,{isloggedInval: false}) ;
}); 



router.post('/reg', function(req, res) {
  var data = new userModel({
    name:req.body.name,
    username:req.body.username,
    email:req.body.email
  })
  userModel.register(data, req.body.password)
  .then(function(userRegistered){
    passport.authenticate('local')(req ,res, function(){
      res.redirect('/profile')
    })
  })
});

router.post('/login', passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/'
}),function(req,res){
 
})

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})


router.get('/profile', function(req,res){
  userModel.findOne({username: req.session.passport.user})
  .populate('cars')
  .exec(function( err ,founduser){
    res.render('profile',{founduser , isloggedInval: true})
  })
 })

 router.post('/uploadit',upload.single('profileimage'), function(req, res) {
    userModel.findOne({username:req.session.passport.user})
    .then(function(getuser){
      getuser.profileimage = `../images/uploads/${req.file.filname}`;
      getuser.save()
      .then(function(){
        res.redirect('/profile')
      })

    })
}); 


router.post('/addcar' , isLoggedIn, upload.single('carimage'), function(req , res){
    userModel.findOne({username: req.session.passport.user})
    .then(function(loggedinuser){
      var carlog = `../images/uploads/${req.file.filename}`;
      carModel.create({
        sellerid : loggedinuser._id,
        carname: req.body.carsname,
        carprice:req.body.carsprice,
        contact: req.body.contact,
        carimg: carlog
      }).then(function(createdcar){
        loggedinuser.cars.push(createdcar);
        loggedinuser.save().then(function(){
          res.redirect('/profile')
          console.log(createdcar, loggedinuser)
          
        })
      })
    })
})

router.get('/sell/:page',isLoggedIn , function(req,res){
  var perPage = 2;
   var page = Math.max(0, req.param('page'));

carModel.find()
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, cars) {
        carModel.count().exec(function(err, count) {
          
            res.render('sellingapp', {
                cars: cars,
                page: page,
                pages: count / perPage,
                isloggedInval: true
            })
        })
    })
})
 
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  else res.redirect('/')
}

function redirecttoprofile(req , res, next){
  if(req.isAuthenticated()) res.redirect('/profile');
  else next();
}


module.exports = router;
