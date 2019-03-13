/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB );
var Schema = mongoose.Schema;


var bookSchema = new Schema({
  "title": {
    type: String,
    required: true
  },
  "comments": [{
    type: String
}],
  "commentcount":Number
});
var Library = mongoose.model('Library', bookSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Library.find({},(err,data)=>{
        res.json(data);
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      var book = new Library({"title":req.body.title, "commentcount":0, "comments":[]});
      book.save((err,data)=>{res.json(data)});
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Library.collection.drop();
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
      Library.findOne({_id:ObjectId(req.params.id)},(err,data)=>{res.json(data)});
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Library.findOne({_id:ObjectId(req.params.id)},(err,data)=>{
          data.comments.push(comment);
          Library.findOneAndUpdate({_id:ObjectId(req.params.id)},{"comments":data.comments}, {new: true},(err,ret)=>{
              res.json(ret);
          });
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Library.deleteOne({_id:ObjectId(bookid)},(err,data)=>{
          if(err){
              res.send('could not delete'+bookid);
          }else{
            console.log('deleted');
            res.send( 'deleted '+bookid);
          }
      });
    
    
    });
  
};
