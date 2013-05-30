Template.groupPage.group = function() {
	var groupId = Session.get('currentGroupId');
	return Groups.find({_id:groupId});
};

Template.groupPage.groupThread = function() {
	var groupId = Session.get('currentGroupId');
	var group = Groups.findOne({_id: groupId});
	console.log(Threads.find({_id: group.threads}).count());
	return Threads.find({_id: {$in: group.threads}});
};

Template.groupPage.owner = function() {
	var groupId = Session.get('currentGroupId');
	if (Meteor.user())
	{
		if (Meteor.user().owned_groups.indexOf(groupId) > -1)
		{
			return true;
		}
		else
			return false;
	}
};

Template.groupPage.events({
	'click button.btnLeaveGroup' : function() {
		var groupId = Session.get('currentGroupId');
		Meteor.call("leaveGroup", groupId, function(data, err){
			groupsSubscription = Meteor.subscribe("groups");
			Meteor.Router.to('/');
		});
	}
})

Template.groupPage.events(okCancelEvents('#invite', {
	ok: function(text, evt){
		var groupId = Session.get('currentGroupId');
		var username = document.getElementById('invite').value;
		Meteor.call("inviteUserToGroup", groupId, username);
		document.getElementById('invite').value = "";
	}
}));