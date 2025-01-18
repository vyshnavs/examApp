const db=require('../config/connection');
const collections=require('../config/collections');
const bcrypt = require('bcrypt');

module.exports={
    doSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
          //to encrypt the password
          adminData.password = await bcrypt.hash(adminData.password, 10)
          const collectionName = 'admins';
    
          try {
            // Connect to the database
            const database = await db.connect();
    
            // Get the collection
            const collection = database.collection(collectionName);
    
            // Create a document to insert
            const admin = {
              name: adminData.name,
              email: adminData.email,
              password: adminData.password,
    
            };
    
            // Insert the user into the collection
            const result = await collection.insertOne(admin);
    
    
            console.log("user inserted successfully:", admin);
    
            id = result.insertedId;
            resolve(adminData)
    
          } catch (error) {
            console.error("Failed to insert user:", error);
            // Handle the error and render an error page or send an error response
            res.status(500).send("Failed to add user. Please try again later.");
          }
    
        })
      }
    }