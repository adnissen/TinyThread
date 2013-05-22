Meteor.Router.add({
  '/' : 'home',

  '/posts/:id': function(id) {
    console.log('we are at ' + this.canonicalPath);
    console.log("our parameters: " + this.params);

    // access parameters in order a function args too
    Session.set('currentPostId', id);
    return 'threadView';
  },

  '*': 'not_found'
});