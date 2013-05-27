Template.create.loggedIn = function() {
	return (Meteor.userId());
}

Template.create.group = function() {
	if (Meteor.user() && Meteor.user().groups)
	{
		console.log(Meteor.user());
		return Groups.find({$or: [{_id : {$in: Meteor.user().groups}}, {_id : {$in: Meteor.user().owned_groups}}]});
	}
}