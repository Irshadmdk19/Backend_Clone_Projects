var express = require('express');
var router = express.Router();
// Importing data models
const userModel= require('./users')
const postModel = require('./posts')

const passport = require('passport')
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))

const upload = require('./multer'); // Import the Multer middleware setup




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav: false});
});

router.get('/login', function(req, res, next) {
  // console.log(req.flash("error"))
  res.render('login',{error: req.flash('error'),nav: false});
});



// Handle file upload

router.post('/fileupload', isLoggedIn, upload.single('image'),async function (req, res,next) {
// Access the uploaded file details vía req.file
  const user= await userModel.findOne({username: req.session.passport.user});
  user.dp= req.file.filename;
  await user.save();
  res.redirect("/profile1")
  // res.send("image uploaded")

});

router.get('/profile1',isLoggedIn, async function(req,res){
  const user= await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts");
  res.render("profile1",{user, nav: true})
})

router.get('/show/posts',isLoggedIn, async function(req,res){
  const user= await userModel.findOne({username: req.session.passport.user})
  .populate("posts");
  res.render("show",{user, nav: true})
})

router.get('/feed',isLoggedIn, async function(req,res){
  const user= await userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find()
  .populate("user");
  res.render("feed",{user, posts})
})


router.get('/add',isLoggedIn, async function(req,res){
  const user= await userModel.findOne({username: req.session.passport.user
  })

  res.render("add",{user, nav: true})
})

router.post('/createpost',isLoggedIn,upload.single("postimage"), async function(req,res){
  const user= await userModel.findOne({username: req.session.passport.user})
  
  const post= await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile1");
  // res.render("add",{user, nav: true})
})

router.post('/register', function(req,res){
  const {username, email, fullname}= req.body;
  const userData= new userModel({username, email, fullname});

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect('./profile1')
    })
  })
})

router.post('/login',passport.authenticate("local",{
successRedirect:'/profile1',
failureRedirect:"/login",
failureFlash: true
}),function(req,res){
  
})

router.get('/logout',function(req,res){
  req.logout(function(err){
    if(err){ return next (err)}
    res.redirect("/")
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){return next()}
  res.redirect('/login')  
}
  


module.exports = router;
