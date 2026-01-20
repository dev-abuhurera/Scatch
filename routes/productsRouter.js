const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const isOwnerLoggedIn = require("../middlewares/isOwner");
const cloudinary = require('cloudinary').v2;
const cloudinary_config = require('../config/cloudinary-config');

router.post("/create", isOwnerLoggedIn, upload.single("image"), async (req, res) => {

    try{

        let { name, price, discount, bgcolor, panelcolor, textcolor } =
          req.body;

        // uploading the image first to the cloudinary

        let imageUrl = ''; // we will use it later to create the product 

        if(req.file){

          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.uploadStream(

              {
                folder: 'scatch/products',
                resource_type: 'auto',

                transformation: [
                  {width: 800, height: 800, crop: 'limit'},
                  { quality: 'auto' }
                ]

              },
              (error, result) => {
                if(error){
                  reject(error)
                }
                else {
                  resolve(result)
                }
              }
            );

            uploadStream.end(req.file.buffer)

          });

          imageUrl = uploadResult.secure_url; // now we will get the url of the image at the cloudinary here 

        }

        // now we will create the image here 

        let product = await productModel.create({

          image: imageUrl, 
          name,
          price,
          discount,
          bgcolor,
          panelcolor,
          textcolor,

        });



        await product.create(productData);

        req.flash("success", "Product created successfully");
        return res.redirect("/owners/admin"); // here will return to the admin session after creating the product
    
    }
    catch(err){
        req.flash('error', 'Error creating product');
        return res.redirect('/owners/admin');
    }
    
});

// Router to delete a single product -----> 

router.post("/delete/:productId", isOwnerLoggedIn, async (req, res) => { // Product id can be changing 
  
  try{

    const { productId } = req.params;
    await productModel.findByIdAndDelete(productId); // ProductModel will find the id and delete the product of that id
    req.flash("success", "Product deleted successfully");
    res.redirect("/owners/admin");

  } catch (err){
    req.flash("error", "Failed to delete the product");
    res.redirect("/owners/admin");

  }}); 


// Router to delete all the products 

router.post("/deleteall", isOwnerLoggedIn, async (req, res) => { // delete all the products 

  try{

    await productModel.deleteMany({});
    req.flash("success", "All products deleted successfully");
    res.redirect("/owners/admin");

  }catch (err){

    req.flash("error", "Failed to delete all products");
    res.redirect("/owners/admin");

  }

});

module.exports = router;