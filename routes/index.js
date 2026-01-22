const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const { router: orderRouter, calculateBill } = require("./orderRouter");
const orderModel = require("../models/order-model");
const router = express.Router();



router.get("/", function (req, res) {

  let error = req.flash("error");
  res.render("index", { error, 
    loggedin: false,
    isAdmin: req.session.user ? req.session.user.isAdmin : false, 
    isHomePage: true
   });

});

router.get("/shop", isLoggedIn, async function (req, res) {

    const { sortby, collection, discounted } = req.query;

    // Build the filter object 

    let filter = {};

    if(collection === 'new'){
      filter.isNew = true;
    }

    if(discounted === 'true'){
      filter.discount = true;
    }

    // sort objects 

    let sort = {};

    switch(sortby){

      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      default:
        sort = { popularity: -1 };

    }

    let products = await productModel.find(filter).sort(sort);

    let success = req.flash("success");
    let error = req.flash("error");
    res.render("shop", { 
    products, 
    isAdmin: req.session.user ? req.session.user.isAdmin : false, 
    success, 
    error,
    sortby,
    collection,
    discounted

  });

});

router.get("/cart", isLoggedIn, async function (req, res) {

  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  let success = req.flash("success");
  let error = req.flash("error");

  // calculate the cart with quantities
  let cartWithQuantities = calculateCartWithQuantities(user.cart || []);
  // Check if cart exists and has items
  let bill = calculateBill(user.cart); // calculating the bill

  res.render("cart", { user, bill, cartWithQuantities,
    isAdmin: req.session.user ? req.session.user.isAdmin : false, 
    success: success.length > 0 ? success[0] : "",
    error : error.length > 0 ? error[0] : "",

  });

});

router.get("/orders", isLoggedIn, async function (req, res) {

  try {
    let success = req.flash("success");
    let error = req.flash("error");
    
    let orders = await orderModel.find({ user: req.user._id }).populate("items.product").sort({ orderDate: -1 }); // finding the orders for the user and sorting them by the order date
    res.render("orders", 
      { orders,
      isAdmin: req.session.user ? req.session.user.isAdmin : false, 
      success : success.length > 0 ? success[0] : "",
      error : error.length > 0 ? error[0] : "",
     });

  } catch (error) {
    
    console.error("Error fetching orders:", error);
    req.flash("error", "Failed to load orders");
    res.redirect("/shop");

  }

});


router.get("/logout", isLoggedIn,  function (req, res) {

  res.render("shop");

});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  
  if (req.user.isAdmin) {
    req.flash("error", "Admins cannot add items to cart");
    return res.redirect("/shop"); // or "/cart" for the second route
  }  

  // console.log(req.user);
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);

  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");

});

// added the item to cart from the cart page 
router.post("/cart/add/:productid", isLoggedIn, async (req,res) =>{

  try{

    if (req.user.isAdmin) {
      req.flash("error", "Admins cannot add items to cart");
      return res.redirect("/shop"); // or "/cart" for the second route
    }

    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/cart");

  } catch (error) {

    console.error("Error adding to cart:", error);
    req.flash("error", "Failed to add to cart");
    res.redirect("/cart");

  }

});

// removed the item from the cart from the cart page 
router.post("/cart/remove/:productid", isLoggedIn, async (req,res) =>{
  try{

    if (req.user.isAdmin) {
      req.flash("error", "Admins cannot add items to cart");
      return res.redirect("/shop"); // or "/cart" for the second route
    }

    let user = await userModel.findOne({email: req.user.email});
    const index = user.cart.findIndex(
      item => item.toString() === req.params.productid
    );

    if(index !== -1){

      user.cart.splice(index, 1);
      await user.save();
      req.flash("success", "Removed from cart");

    }else{

      req.flash("error", "Item not found in cart");

    }
    res.redirect("/cart");

  } catch (error) {

    console.error("Error removing from cart:", error);
    req.flash("error", "Failed to remove from cart");
    res.redirect("/cart");
    
  }

});


// Helper function to calculate the cart with quantities

function calculateCartWithQuantities(cart){

  const itemMap = new Map();

  cart.forEach( item => {
    const itemId = item._id.toString();
    if(itemMap.has(itemId)){
      itemMap.get(itemId).quantity++;
    }else{
      // convert mongoose object to plain object
      const itemObj = item.toObject ? item.toObject() : item;
      itemMap.set(itemId, {
        ...itemObj, 
        quantity: 1
      });

    }
  });

  return Array.from(itemMap.values());

}



module.exports = router;
