const db=require('../config/connection');
const collections=require('../config/collections');
const bcrypt = require('bcrypt');

module.exports={
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
          //to encrypt the password
          userData.password = await bcrypt.hash(userData.password, 10)
          const collectionName = 'users';
    
          try {
            // Connect to the database
            const database = await db.connect();
    
            // Get the collection
            const collection = database.collection(collectionName);
    
            // Create a document to insert
            const user = {
              name: userData.name,
              email: userData.email,
              password: userData.password,
    
            };
    
            // Insert the user into the collection
            const result = await collection.insertOne(user);
    
    
            console.log("user inserted successfully:", user);
    
            id = result.insertedId;
            resolve(userData)
    
          } catch (error) {
            console.error("Failed to insert user:", error);
            // Handle the error and render an error page or send an error response
            res.status(500).send("Failed to add user. Please try again later.");
          }
    
        })
      },
      doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
          let loginStatus = false;
          let response = {};
          //take data from database
          let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email });
    
          if (user) {
            //comparing the passwords.Bcrypt has internal promise function.
            bcrypt.compare(userData.password, user.password).then((status) => {
    
              if (status) {
                //setting session details for user
                response.status = true;
                response.user=user;
                
                resolve(response);
              }
              else {
                console.log('login failed');
                resolve({ status: false });
    
              }
            })
          }
          else {
            console.log('login failed');
            resolve({ status: false });
    
          }
        })
      },
}