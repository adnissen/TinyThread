Meteor.Router.add({
  '/' : 'home',
  '/posts/new': function() {
  	//make sure they're logged in
  	if (Meteor.user())
  	{
  		return 'create';
  	}
  	else
  		return 'not_found';
  },
  '/posts/:id': function(id) {
  	//are they logged in?
  	if (Meteor.user())
  	{
	  	if (Threads.find({_id: id}).count() != 0)
	  	{
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

  '/groups/new' : function() {
	//make sure they're logged in
  	if (Meteor.user())
  	{
  		return 'createGroup';
  	}
  	else
  		return 'not_found';
  },

  '/groups/:id': function(id) {
  	if (Meteor.user())
  	{
  		if (Groups.find({_id: id}).count() != 0)
  		{
  			Session.set('currentGroupId', id);
  			return 'groupPage';
  		}
  	}	
  	else
  		return 'group_not_found';
  },


  '*': 'not_found'
});