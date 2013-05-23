Meteor.Router.add({
  '/' : 'home',

  '/posts/:id': function(id) {
  	//are they logged in?
  	if (Meteor.user())
  	{
	  	if (Threads.find({_id: id}).count() != 0)
	  	{
		    console.log('we are at ' + this.canonicalPath);
		    console.log("our parameters: " + this.params);

		    // access parameters in order a function args too
		    //only actually let them into the page if they're authed
		    //honestly, this step might not be needed, since they
		    //shouldn't have the content anyways. 

		    //better safe than sorry!
			Session.set('currentThreadId', id);
			return 'threadView';
		}
	}
	else
		return 'not_found';
  },

  '/create': function() {
  	//make sure they're logged in
  	if (Meteor.user())
  	{
  		
  	}
  	else
  		return 'not_found';
  }

  '*': 'not_found'
});