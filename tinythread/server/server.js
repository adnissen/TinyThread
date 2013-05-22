Threads = new Meteor.Collection("threads");
Replies = new Meteor.Collection("replies");
Threads.allow({
	insert: function(userId, thread) {
		return false;
	},
	update: function(userId, thread) {
		return false;
	},
	remove: function(userId, thread) {
		return false; //just making all these fals to start
	}
});

Meteor.publish("directory", function(){
	return Meteor.users.find({});
});

Meteor.publish("threads", function(){
	if (!this.userId)
		return null;
	//you only get the threads you're id'd for
	var user = Meteor.users.findOne({_id: this.userId});
	return Threads.find({_id : {$in: user.authList}});
});

Meteor.publish("replies", function(){
	return Replies.find({})
});

Meteor.startup(function () {
    // code to run on server at startup
    if (Threads.find({}).count() == 0)
    	Threads.insert({owner_id: 91283710239, owner_username: "adnissen", title: "Towels?", content: "I think we need new towels guys"});

});

//add an auth list for when the users are created
Accounts.onCreateUser(function(options, user) {
  user.authList = [];
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});

//permissions: 0 for public, 1 for private
//if something is public, anyone can view or post in it
//if it's private, only invited people can post
Meteor.methods({
	createThread:function(_title, _content)
	{
		var newThreadId = Threads.insert({owner_id: Meteor.userId(), owner_username: Meteor.user().username, title: _title, content: _content});
		Meteor.users.update({_id: Meteor.userId()}, {$push: {authList: newThreadId}});
	},

	//grant post access to another user
	authUser:function(_thread, _username)
	{
		//check to make sure the person running this command is the author of the thread
		if (Meteor.userId() != null && Meteor.userId() == Threads.findOne({_id: _thread}).owner_id)
		{
			//make sure the user exists
			if (Meteor.users.find({username: _username}).count() == 1)
			{
				Meteor.users.update({username: _username}, {$push: {authList: _thread}});
			}
		}
	}
});