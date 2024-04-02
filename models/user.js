const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const getDb = require('../util/database').getDb;
class User{
  constructor(name,email,cart,id)
  {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id
  }
  save(){
    const db = getDb();
    return db.collection('users').insertOne(this);
  }
  addToCart (product){
    let cartproductIndex = -1;
    let updatedCartItems =[]
    if(this.cart)
    {
    cartproductIndex = this.cart.items.findIndex(cp =>{
      return cp.productId.toString() === product._id.toString();
    })
    updatedCartItems = [...this.cart.items];
   
  }
  let newQuantity =1;
  if(cartproductIndex >= 0)
    {
      newQuantity = this.cart.items[cartproductIndex].quantity +1;
      updatedCartItems[cartproductIndex].quantity = newQuantity
    }
    else{
       updatedCartItems.push({productId: new ObjectId(product._id),quantity:newQuantity});
    }
    const db = getDb();
    
    const updatedCart = {items: updatedCartItems};
    return db
          .collection('users')
          .updateOne({_id:new ObjectId(this._id)},{$set:{cart: updatedCart}});
    
  }
  static findById(userId)
  {
    const db = getDb();
    return db.collection('users')
           .find({_id:new ObjectId(userId)})
           .next()
           .then (user =>{
            console.log(user);
            return user;
          })
          .catch (err =>{
            console.log(err);
          })

  }
}


module.exports = User;
