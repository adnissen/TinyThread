Threads = new Meteor.Collection("threads")
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
	return Threads.find({});
});

Meteor.startup(function () {
    // code to run on server at startup
    if (Threads.find({}).count() == 0)
    	Threads.insert({owner_id: 91283710239, owner_username: "Andrew", permissions: 0, title: "Towels?", content: "I think we need new towels guys"});

});

//permissions: 0 for public, 1 for private
//if something is public, anyone can view or post in it
//if it's private, only invited people can post
Meteor.methods({
	createThread:function(_permissions, _title, _content)
	{
		Threads.insert({owner: Meteor.userId(), permissions: _permissions, title: _title, content: _content});
	}
});