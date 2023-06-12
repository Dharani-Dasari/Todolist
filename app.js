//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const _= require("lodash");
require("dotenv").config();
// console.log(process.env.USERNAME_DB);
// const date = require(__dirname + "/date.js");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// const username =process.env.USERNAME_DB;
// const password = process.env.PASSWORD;
mongoose.connect("mongodb+srv://Dharani:Atlas@cluster0.65wi1et.mongodb.net/todolistDB");

const itemsSchema={
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
const item1= new Item({
  name:"Welcome to your todolist"
});
const item2= new Item({
  name: "Hit the + button to add new items"
});
const item3 =new Item({
  name:"<-- Hit this to delete an item"
});

const defaultItems=[item1,item2,item3];
const listSchema ={
  name: String,
  items:[itemsSchema]
}

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems)
//   .then(
//   () => {
//      console.log("Items added succesfully");
//   }
// ).catch(
//   (err) => {
//      console.log(err);
//   }
// );
app.get("/", function(req, res) {

  
  Item.find({}).then(function(FoundItems){
    // console.log(FoundItems);
    if(FoundItems.length === 0){
      Item.insertMany(defaultItems)
    .then(
    () => {
      console.log("Items added succesfully");
      }
    ).catch(
    (err) => {
     console.log(err);
    }
    );
  res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: FoundItems});
    }
   res.render("list", {listTitle: "Today", newListItems: FoundItems});

  })
   .catch(function(err){
    console.log(err);
  })

  // res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName =req.body.list;

  const useraddeditem = Item ({
    name: itemName
  });
  if(listName === "Today"){
    useraddeditem.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName})
    .then((foundList)=>{
      foundList.items.push(useraddeditem)
      foundList.save()
      res.redirect("/"+ listName)})
    .catch((err)=>{
      console.log(err);
    });
    
  }
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});
app.post("/delete", function(req,res){
 const checkedItemId= req.body.checkbox;
 const listName =req.body.listName;
 if(listName === "Today"){
  Item.findByIdAndRemove(checkedItemId)
 .then(()=>{
  console.log("Successfully Removed");
 })
 .catch((err)=>{
  console.log(err);
 })
 res.redirect("/");
}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id: checkedItemId}}})
  .then(()=>
  res.redirect("/"+listName))
   .catch((err)=>{
    console.log(err);
   })
}});



app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName})
  .then((foundlist)=>{
    if(!foundlist){
      // console.log("Doesn't exits!");
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+ list.name);
    }else{
      // console.log("exits!");
      res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});
    }
  })
  .catch((err)=>{
    console.log(err);
  });
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});




// npm install ---to get node_modules..
// connecting todolist to mongodb