const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const getDb = require('../util/database').getDb;
class User{
  constructor(name,email)
  {
    this.name = name;
    this.email = email
  }
  save(){
    const db = getDb();
    return db.collection('users').insertOne(this);
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
