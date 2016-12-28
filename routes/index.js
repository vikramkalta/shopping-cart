var express = require("express");
var router = express.Router();

var Cart = require("../models/cart")
var Product = require("../models/product");
var Order = require("../models/order");
var mongoose = require("mongoose");

router.get("/", function(req, res, next){
    var successMsg = req.flash("success")[0];
    var products = [
    new Product({
   imagePath: "https://i.ytimg.com/vi/b4ySfqwG0hs/maxresdefault.jpg",
   title: "Gothic videogame",
   description: "Awesome game",
   price: 10
}),
   new Product({
   imagePath: "http://files.all-free-download.com//downloadfiles/wallpapers/1680_1050/mafia_ii_wallpaper_mafia_2_games_3171.jpg",
   title: "Super Mario",
   description: "Awesome game",
   price: 10
}),
   new Product({
   imagePath: "http://www.desktopwallpaperhd.net/wallpapers/18/4/game-design-beautiful-background-wallpaper-games-185860.jpg",
   title: "San Andreas",
   description: "Awesome game",
   price: 10
}),
   new Product({
   imagePath: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT84WgPF9tULJUbCLvsC3PSCBQJRgxI1giQqwaiBfgNs43g7u84",
   title: "Max Payne",
   description: "Awesome game",
   price: 10
}),
];

    Product.find(function(err, docs){
        if(err){
            console.log(err)
        }else {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
         res.render("shop/index", { title: "Shopping Cart", products: productChunks, successMsg: successMsg, noMessages: !successMsg });
        }
    });
   });
   
router.get("/add-to-cart/:id", function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    Product.findById(productId, function(err, product){
        if(err){
            return res.redirect("/");
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/");
    });
});

router.get("/reduce/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}); 
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
});
router.get("/remove/:id", function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {}); 
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
});

router.get("/shopping-cart", function(req, res, next) {
   if(!req.session.cart){
       return res.render("shop/shopping-cart", {products: null});
   } 
   var cart = new Cart(req.session.cart);
   res.render("shop/shopping-cart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get("/checkout", isLoggedIn, function(req, res, next) {
    if(!req.session.cart){
       return res.redirect("/shopping-cart");
   }
   var cart = new Cart(req.session.cart);
   var errMsg = req.flash("error")[0];
   res.render("shop/checkout", {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post("/checkout", isLoggedIn, function(req, res, next){
     if(!req.session.cart){
       return res.redirect("/shopping-cart");
   }
   var cart = new Cart(req.session.cart);
   var stripe = require("stripe")(
  "sk_test_0YaZX8vJu5zIf4VAIcl4JDlx"
);
stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: "usd",
  source: req.body.stripeToken, // obtained with Stripe.js
  description: "Test Charge"
}, function(err, charge) {
    if(err){
        req.flash("error", err.message);
        return res.redirect("/checkout")
    }
    var order = new Order({
       user: req.user,
       cart: cart,
       address: req.body.address,
       name: req.body.name,
       paymentId: charge.id
    });
    order.save(function(err, result){
         req.flash("success", "Successfully bought product!");
    req.session.cart = null;
    res.redirect("/");
    });
});
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect("/user/signin");
}