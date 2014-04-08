/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var bcrypt = require('bcrypt-nodejs');
var Firebase = require('firebase');
var reqmeApp = new Firebase('https://reqmeapp.firebaseio.com/');
var FirebaseTokenGenerator = require("firebase-token-generator");
var firebaseSecret="0pPB8qy8V9XFMnPDvueJmQMMabhFKc6BOytfsEil";

module.exports = {
  
  /**
   * Action blueprints:
   *    `/auth/login`
   */
   login: function (req, res) {

    console.log("check if server already authenticated");

    var serverAuth = new Firebase('https://reqmeapp.firebaseio.com/server');
      serverAuth.once('value', function(snap){
          var value=snap.val();
          if(value==null||value==undefined||value==false){
              var dataRef = new Firebase("https://reqmeapp.firebaseio.com/");
              dataRef.auth(firebaseSecret, function(error) {
                  if(error) {
                      console.log("Server Auth Failed!", error);
                  } else {
                      console.log("Server Auth Sukses");
                      serverAuth.set(true);
                      userAuth();
                  }
              });
          }else{
              console.log("server already auth");
              userAuth();
          }
    });

      function userAuth(){
          reqmeApp = new Firebase('https://reqmeapp.firebaseio.com/admin');
          var user = req.body;

          if(user.username==null||user.username==undefined||user.password==null||user.password==undefined){
              return res.json({
                  response : "Error",
                  message : "Error, Bad username  / Password"
              })
          }

          if(req.session.user!=null){
              console.log("user already logged in");
              return res.json(req.session.user);
          }

          console.log("username === >" + user.username);
          console.log("password == > "+user.password);
          reqmeApp.startAt(user.username)
              .endAt(user.username)
              .once('value', function(snap){
                  if(snap.val()==null||snap.val()==undefined){
                      console.log("Username Not Found");
                      return res.json({
                          response : "Error",
                          message : "Error, Bad username  / Password"
                      })
                  }else{
                      console.log("User found");
                      var adminData=null;
                      var customerData=snap.val();
                      for (var key in customerData){
                          if (customerData.hasOwnProperty(key)) {
                              adminData = customerData[key];
                          }
                      }
                      console.log("Now Checking Password");
                      console.log(JSON.stringify(snap.val(), null, 2));
                      bcrypt.compare(user.password, adminData.password, function(err, response) {
                          if(response==false){
                              console.log("Wrong Password");
                              return res.json({
                                  response : "Error",
                                  message : "Error, Bad username  / Password"
                              });
                          }else{
                              var today = new Date();
                              var expiresDate = new Date();
                              expiresDate.setDate(today.getDate()+30);
                              var tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);
                              var token = tokenGenerator.createToken({user: adminData},{admin: true,expires:expiresDate.getTime()});
                              adminData.response="Success";
                              adminData.password=null;
                              adminData.token=token;
                              req.session.user=adminData;
                              req.session.token=token;
                              req.session.authenticated=true;
                              return res.json(adminData);
                              /*console.log("token===>"+token);
                               var dataRef = new Firebase("https://reqmeapp.firebaseio.com/");
                               dataRef.auth(token, function(error) {
                               if(error) {
                               console.log("Login Failed!", error);
                               return res.json({
                               response : "Error",
                               message : "Error When authenticate to firebase"
                               });
                               } else {
                               console.log("Login Sukses");
                               adminData.response="Success";
                               adminData.password=null;
                               adminData.token=token;
                               req.session.user=adminData;
                               req.session.token=token;
                               req.session.authenticated=true;
                               return res.json(adminData);
                               }
                               });*/
                          }
                      });
                  }
              });
      }





    // Send a JSON response
  },


  /**
   * Action blueprints:
   *    `/auth/logout`
   */
   logout: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

  
};
