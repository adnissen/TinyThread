Threads = new Meteor.Collection("threads");
Replies = new Meteor.Collection("replies");
Groups = new Meteor.Collection("groups");
Threads.allow({
	insert: function(userId, thread) {
		return false;
	},
	update: function(userId, thread) {
		return false;
	},
	remove: function(userId, thread) {
		return false; //just making all these false to start
	}
});

Meteor.publish("directory", function(){
	return Meteor.users.find({}, {fields: {'groups': 1, 'owned_groups': 1, 'invites': 1}});
});

Meteor.publish("threads", function(){
	if (!this.userId)
		return null;
	//you only get the threads you're id'd for
	var user = Meteor.users.findOne({_id: this.userId});
	return Threads.find({$or: [{_id : {$in: user.authList}}, {public: 1}]});
});

Meteor.publish("replies", function(){
	if (!this.userId)
		return null;
	var user = Meteor.users.findOne({_id: this.userId});
	return Replies.find({parent: {$in: user.authList}});
});

Meteor.publish("groups", function(){
	return Groups.find();
});

Meteor.startup(function () {
    // code to run on server at startup
    if (Threads.find({}).count() == 0)
    	Threads.insert({owner_id: 91283710239, owner_username: "adnissen", title: "Towels?", content: "I think we need new towels guys"});

});

//add an auth list for when the users are created
Accounts.onCreateUser(function(options, user) {
  user.authList = [];
  user.groups = [];
  user.invites = [];
  user.owned_groups = [];
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});

//permissions: 0 for public, 1 for private
//if something is public, anyone can view or post in it
//if it's private, only invited people can post
Meteor.methods({
	createGroup: function(_name, _description)
	{
		if (Meteor.userId() != null)
		{
			var time = new Date();
			var timestamp = time.getTime();
			var newGroupId = Groups.insert({createdTime: timestamp, owner_id: Meteor.userId(), owner_username: Meteor.user().username, name: _name, description: _description, threads: []});
			Meteor.users.update({_id: Meteor.userId()}, {$push: {owned_groups: newGroupId}});
			return newGroupId;
		}
	},
	inviteUserToGroup: function(_group, _username)
	{
		if (Meteor.userId() != null)
		{
			var user = Meteor.users.findOne({username: _username});
			if (user)
			{
				if (Meteor.user().owned_groups.indexOf(_group) > -1)
				{
					
					if (user.groups.indexOf(_group) > -1 || user.owned_groups.indexOf(_group) > -1)
						return "already in group";
					else
						Meteor.users.update({username: _username}, {$push: {invites: _group}});
				}
			}
		}
	},
	acceptGroup: function(_group)
	{
		if (Meteor.userId() != null)
		{
			if (Meteor.user().owned_groups.indexOf(_group) > -1 || Meteor.user().groups.indexOf(_group) > -1)
				return null;
			else if (Meteor.user().invites.indexOf(_group) > -1)
			{
				Meteor.users.update({_id: Meteor.userId()}, {$push: {groups: _group}});
				Meteor.users.update({_id: Meteor.userId()}, {$pull: {invites: _group}});
				var group = Groups.findOne({_id: _group});
				Meteor.users.update({_id: Meteor.userId()}, {$push: {authList: {$each: group.threads}}});
			}

		}
	},
	declineGroup: function(_group)
	{
		if (Meteor.userId() != null)
		{
			if (Meteor.user().owned_groups.indexOf(_group) > -1 || Meteor.user().groups.indexOf(_group) > -1)
				return null;
			else if (Meteor.user().invites.indexOf(_group) > -1)
			{
				Meteor.users.update({_id: Meteor.userId()}, {$push: {groups: _group}});
				Meteor.users.update({_id: Meteor.userId()}, {$pull: {invites: _group}});
			}

		}
	},
	leaveGroup: function(_group)
	{
		if (Meteor.userId() != null)
		{
			if (Groups.find({_id: _group}).count() == 1)
			{
				if (Meteor.users.find({$in: {groups: _group}}).count() == 0)
				{
					//the person leaving is the only one left and it can go ahread and die
					Meteor.users.update({_id: Meteor.userId()}, {$pull: {owned_groups: _group}});
					Groups.remove({_id: _group});
				}
				if (Meteor.user().owned_groups.indexOf(_group) > -1)
				{
					//if owner: transfer ownership to the next user
					var newOwner = Meteor.users.findOne({groups: _group});
					Meteor.users.update({_id: newOwner._id}, {$pull: {groups: _group}});
					Meteor.users.update({_id: newOwner._id}, {$push: {owned_groups: _group}});

					//now remove it from the original user
					Meteor.users.update({_id: Meteor.userId()}, {$pull: {owned_groups: _group}});

					//update the group information
					Groups.update({_id: _group}, {owner_id: newOwner._id});
					Groups.update({_id: _group}, {owner_username: newOwner.username});
				}
				else
				{
					//if they're just a normal member, removing them is easy
					Meteor.users.update({_id: Meteor.userId()}, {$pull: {groups: _group}});
				}
			}
		}
	},
	createThread:function(_title, _content, _public, _groups)
	{
		if (Meteor.userId() != null)
		{
			var time = new Date();
			var timestamp = time.getTime();
			var newThreadId = Threads.insert({time: timestamp, public: _public, owner_id: Meteor.userId(), owner_username: Meteor.user().username, title: _title, content: _content});
			Meteor.users.update({_id: Meteor.userId()}, {$push: {authList: newThreadId}});
			for (var i = 0; i < _groups.length; i++) {
				console.log(_groups[i] + " thread: " + newThreadId);
				Meteor.users.update({$or: [{groups: _groups[i]}, {owned_groups: _groups[i]}]}, {$push: {authList: newThreadId}}, {multi: true});
				Groups.update({_id: _groups[i]}, {$push: {threads: newThreadId}});
			};
			return newThreadId;
		}
	},

	deleteThread:function(_thread)
	{
		if (Meteor.userId() != null)
		{
			var thread = Threads.findOne({_id: _thread});
			if (thread.owner_id == Meteor.userId())
			{
				Threads.remove({_id: _thread});
				Meteor.users.update({authList: _thread}, {$pull: {authList: _thread}}, {multi: true});
			}
		}
	},

	leaveThread: function(_thread)
	{
		if (Meteor.userId() != null)
		{
			var group = Groups.findOne({_id: _thread});
			if (Meteor.user().authList.indexOf(_thread) > -1)
			{
				Meteor.users.update({_id: Meteor.userId()}, {$pull: {authList: _thread}});
			}
		}
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
	},

	//add a comment
	addReply:function(_thread, _content)
	{
		if (!_content || /^\s*$/.test(_content))
		{
			return;
		}
		//make sure they're logged in and can comment
		if (Meteor.userId() != null && Meteor.user().authList.indexOf(_thread) > -1)
		{
			var time = new Date();
			var timestamp = time.getTime();
			Replies.insert({time: timestamp, owner_id: Meteor.userId(), owner_username: Meteor.user().username, parent: _thread, content: _content});
		}

	},
	deleteReply:function(_reply)
	{
		if (Meteor.userId() != null && Meteor.userId() == Replies.findOne({_id: _reply}).owner_id)
		{
			Replies.remove({_id: _reply});

		}
	}
});