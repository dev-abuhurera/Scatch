const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const isOwnerLoggedIn = require("../middlewares/isOwner");
const cloudinary = require('../config/cloudinary-config');
const imageId = require('../utils/idExtraction');

router.post("/create",isOwnerLoggedIn,upload.single("image"),async (req, res) => {

    try {

      const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

      let imageUrl = "";
      

      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "scatch/products",
              transformation: [
                { width: 800, height: 800, crop: "limit" },
                { quality: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(req.file.buffer);
        });

        imageUrl = uploadResult.secure_url;
        uploadedPublicId = uploadResult.public_id; // this we will use in the delete session 
      }

      await productModel.create({
        image: imageUrl,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
      });



      req.flash("success", "Product created successfully");
      return res.redirect("/owners/admin");


      } catch (err) {

        console.error("PRODUCT CREATE ERROR:", err.message);
        // Thus now the image will automatically being destroyed by the cloudinary 

        if (uploadedPublicId) {
          try {
            await cloudinary.uploader.destroy(uploadedPublicId);
            console.log("Cleaned up uploaded image:", uploadedPublicId);
          } catch (deleteErr) {
            console.error("Failed to delete image:", deleteErr.message);
          }
        }

        console.error(err.errors || err);
        req.flash('error', 'Error creating product: ' + err.message);
    }
    
  }
  

);

// Router to delete a single product -----> 

router.post("/delete/:productId", isOwnerLoggedIn, async (req, res) => { // Product id can be changing 
  
  try{

    const { productId } = req.params;

    const product = productModel.findById(productId);

    if(!product){
      req.flash("error", "Product not found");
      return res.redirect("/owners/admin");
    }

    await productModel.findByIdAndDelete(productId); // ProductModel will find the id and delete the product of that id

    if(product.image){

      try{
      
        const productId = imageId(product.image);

        if(productId){

          cloudinary.uploader.destroy(productId);

        }

      }catch(err){
        
        req.flash("error", "Failed to delete the image")
        return res.redirect("/owners/admin");

      }

    }

    req.flash("success", "Product deleted successfully");
    return res.redirect("/owners/admin");


  } catch (err){

    req.flash("error", "Failed to delete the product");
    return res.redirect("/owners/admin");

  }}); 


// Router to delete all the products 

router.post("/deleteall", isOwnerLoggedIn, async (req, res) => { // delete all the products 

  try{

     // Get all products first to access their images
    const products = await productModel.find({});

    if(!products){

      req.flash("error", "Products not found");
      return res.redirect("/owners/admin");

    }

    await productModel.deleteMany({}); // removed all the products from here 

    if(products.image){

      try{

        const publicIds = imageId(products.image);

        if(publicIds){

          await cloudinary.uploader.destroy(publicIds);

        }

      } catch(err){

        req.flash("error","Unable to delete")

      }

    }


    req.flash("success", "All products deleted successfully");
    return es.redirect("/owners/admin");

  }catch (err){

    req.flash("error", "Failed to delete all products");
    return res.redirect("/owners/admin");

  }

});

module.exports = router;