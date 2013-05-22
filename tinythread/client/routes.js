Meteor.Router.add({
  '/' : 'home',

  '/posts/:id': function(id) {

  	if (Threads.find({_id: id}).count() != 0)
  	{
	    console.log('we are at ' + this.canonicalPath);
	    console.log("our parameters: " + this.params);

	    // access parameters in order a function args too
	    Session.set('currentPostId', id);
	    return 'threadView';
	}
	else
		return 'not_found';
  },

  '*': 'not_found'
});