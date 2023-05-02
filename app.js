//imports----------------------------
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mime = require('mime');
const cookieParser = require('cookie-parser');

//constants--------------------------
const app = express();
const port = 3400;

//all app.use-------------------------
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.use(cookieParser());

//this was to remove that MIME warning while fetching css file
app.get('/public/css/style.css', (req, res) => {
    res.setHeader('Content-Type', mime.getType('public/css/style.css'));
    res.sendFile(__dirname + '/public/css/style.css');
  });

//get requests------------------------

app.get("/authenticate",(req,res)=>{
    res.sendFile(__dirname+"/authenticate.html");
});

app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/login.html");
});

app.get("/signup",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
    console.log("**********app get signup");
})

app.get("/signupsuccess",(req,res)=>{
    res.sendFile(__dirname+"/signupsuccess.html");
})
//post requests------------------------

app.post("/signup",(req,res)=>{
    // res.sendFile(__dirname+"/signup.html")

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    //check if credentials are correct
    //we will have to use mongodb for this
    
    console.log("successfully signed up")
    //set the auth cookie if the login is successful
    res.cookie(`${email}`,`${password}`,{maxAge: 5000, httpOnly:true});
    //redirect the user to the dashboard page
    // res.redirect('/signupsuccess');
    res.redirect("/login")
    
});

app.post("/login",(req,res)=>{
    res.sendFile(__dirname+"/login.html")

    const email = req.body.email;
    const password = req.body.password;

    // console.log(email);
    // console.log(password);

    //check if credentials are correct
    //we will have to use mongodb for this

    //set the auth cookie if the login is successful
    res.cookie(`${email}`,`${password}`,{maxAge: 50000, httpOnly:true});

    //redirect the user to the dashboard page
    console.log("redirecting to dashboard");
    res.redirect('/dashboard');
});

app.get('/dashboard',(req,res)=>{
    console.log("inside dashboard");
    const authCookie = req.cookies.auth;

    //if auth cookie is not present, then redirect to the login page
    if(!authCookie){
        return res.redirect('/login');
    }

    //if auth cookie is present, then send to the dashboard page
    res.sendFile(__dirname+'/dashboard.html');
})

app.get('/logout',(req,res)=>{
    //clear the auth coookie to log out the user
    res.clearCookie('auth');

    //redirect the user to the login page
    res.redirect('/authenticate');
})

//server listening------------------------
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

