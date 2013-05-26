Template.home.loggedIn = function() {
	return (Meteor.userId());
}

Template.home.threadCount = function() {
	return Threads.find().count();
}

Template.home.thread = function() {
	return Threads.find();
}

Template.home.group = function() {
	if (Meteor.user())
	{
		return Groups.find({$or: [{_id : {$in: Meteor.user().groups}}, {_id : {$in: Meteor.user().owned_groups}}]});
	}
}