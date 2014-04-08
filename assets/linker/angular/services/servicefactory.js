/**
 * Created by fahmi on 3/30/14.
 */
'use strict';

angular.module('reqmeApp')
    .factory('ServiceFactory', function ServiceFactory(firebaseRef) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return{

            url : function(endPoint){
                return "http://localhost:1337/"+endPoint;
            },

            saveOnce : function(user,provider){
                var ref=firebaseRef('customer')
                    .push();
                user.child=ref;
                ref.setWithPriority({
                    'uid':user.uid,
                    'email':(user.email == undefined ||user.email == null ?'':user.email),
                    'login_using':provider,
                    'auth_id':user.id,
                    'access_token':(user.accessToken == undefined ||user.accessToken == null ?'':user.accessToken),
                    'access_token_secret':(user.accessTokenSecret == undefined ||user.accessTokenSecret == null ?'':user.accessTokenSecret),
                    'name':user.displayName,
                    'data_complete_status':'not_complete'
                }, user.uid);


            }
        }
    });
