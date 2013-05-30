Template.home.loggedIn = function() {
	return (Meteor.userId());
}

Template.home.threadCount = function() {
	return Threads.find().count();
}

Template.home.thread = function() {
	return Threads.find({}, {sort: {time: -1}});
}

Template.home.group = function() {
	if (Meteor.user() && Meteor.user().groups)
	{
		return Groups.find({$or: [{_id : {$in: Meteor.user().groups}}, {_id : {$in: Meteor.user().owned_groups}}]});
	}
}