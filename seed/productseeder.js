var Product = require("../models/product");
var mongoose = require("mongoose");


//mongoose.connect("mongodb://localhost/shopping-cart");
mongoose.connect("mongodb://Vikram_Kalta:boomshankar1@ds145208.mlab.com:45208/sellstuff");
 
 

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
var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length) {
           exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}