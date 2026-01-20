const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");
const productModel = require("../models/product-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const isOwnerLoggedIn = require("../middlewares/isOwner");


    
    router.post("/register", async (req, res) => {
        try {
            let owners = await ownerModel.find();
            if(owners.length > 0) {
                req.flash("error", "Owner already exists. Please login.");
                return res.redirect("/owners/register");
            }
    
            let {fullname, email, password} = req.body;
    
            let existingOwner = await ownerModel.findOne({ email });
    
            if(existingOwner){
                req.flash("error", "Email already registered");
                return res.redirect("/owners/register"); // Fixed: was /owner/register
            }
    
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        req.flash("error", "Failed to create account");
                        return res.redirect("/owners/register");
                    }
                    
                    let createdOwner = await ownerModel.create({
                        fullname,
                        email,
                        password: hash
                    });
    
                    req.flash("success", "Account created successfully! Please login.");
                    res.redirect("/owners/login"); // Removed res.status(201).send() - can't send both
                });
            });
        } catch (err) {
            req.flash("error", "Failed to create the account");
            res.redirect("/owners/register");
        }
    });

// Add the get router to render the admin registeration page 
router.get("/register", (req, res) => {

    let error = req.flash("error");
    let success = req.flash("success");
    res.render("owner-register", {error, success});

})


// Owner login page 
router.post("/login", async (req, res) => {

try{
    let {email, password} = req.body;
    let owner = await ownerModel.findOne({email: email});

    if(!owner){
        req.flash("error", "Owner not found");
        return res.redirect("/owners/login");
    }

    bcrypt.compare(password, owner.password, (err, result) => {

        if(result){
            
            let token = generateToken(owner);
            res.cookie("ownerToken", token);
            req.flash("success", "Login successful");
            res.redirect("/owners/admin");
        }
        else{
            req.flash("error", "Invalid password");
            return res.redirect("/owners/login");
        }
    });
    
    } catch(err) {

        req.flash("error", "Failed to login");
        return res.redirect("/owners/login");

    }
});


// Owner login page
router.get("/login", (req, res) => {

    let error = req.flash("error");
    let success = req.flash("success");
    res.render("owner-login", {error, success});

})


// Owner logout page 

router.get("/logout", (req, res) => {

    res.cookie("ownerToken", "", { expires: new Date(0) });
    req.flash("success", "Logged out successfully");
    res.redirect("/owners/login");

})



// Protected route
router.get("/admin",isOwnerLoggedIn, async (req, res) => {

    try{

        let products = await productModel.find();
        let success = req.flash("success");
        let error = req.flash('error');
        res.render("admin", {products, success, error});

    }catch(err){

        req.flash("error", "Failed to load products");
        res.redirect("/owners/admin");
        
    }

});


router.get("/admin/create", isOwnerLoggedIn, (req, res) => {
    
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("createproducts", {success, error});

});

module.exports = router;