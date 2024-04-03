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

  getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i =>{
      return i.productId;
    })
    return db.collection('products')
             .find({_id: {$in : productIds}})
             .toArray()
             .then(products =>{
              return products.map(p =>{
                return {...p,
                quantity : this.cart.items.find(i => {
                  return i.productId.toString() === p._id.toString();
                }).quantity
              };
              });
             })
  }

  deleteCartItem(prodId){
    const db = getDb();
    let updatedCartItems = this.cart.items.filter( products =>{
      return prodId.toString() !== products.productId.toString();
    })
    return db.collection('users')
              .updateOne(
                {_id : new ObjectId(this._id)},
                { $set: { cart: { items: updatedCartItems } } }
  );
  }

  addOrder (){
    const db = getDb();
    return this.getCart()
      .then (products =>{
       const order = {
        items: products,
        user:{
          _id: new ObjectId(this._id),
          name: this.name
         }
        };
        return db
          .collection('orders')
          .insertOne(order)

    })
    .then (result => {
            this.cart = {items :[]};
            return db
                  .collection('users')
                  .updateOne(
                    {_id : new ObjectId(this._id)},
                    {$set: { cart: {items : []}}}
                  );
          });
  };

  getOrders(){
    const db = getDb();
    return db.collection('orders')
             .find({'user._id': new ObjectId(this._id)})
             .toArray();
            
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
