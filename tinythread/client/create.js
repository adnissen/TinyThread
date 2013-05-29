Template.create.loggedIn = function() {
	return (Meteor.userId());
}

Template.create.group = function() {
	if (Meteor.user() && Meteor.user().groups)
	{
		return Groups.find({$or: [{_id : {$in: Meteor.user().groups}}, {_id : {$in: Meteor.user().owned_groups}}]});
	}
}

Template.create.events({
	'click button.btnCreateThread' : function(){
		var title = document.getElementById('newThreadTitle').value;
		var content = document.getElementById('txtContent').value;
		var groups = $('#groupSelect').val();
		Meteor.call("createThread", title, content, 0, groups, function(err, data) {
			threadsSubscription = Meteor.subscribe("threads");
			repliesSubscription = Meteor.subscribe("replies");
			groupsSubscription = Meteor.subscribe("groups");
			Meteor.Router.to('/posts/' + data);
		});
	}
})