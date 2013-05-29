Template.createGroup.loggedIn = function() {
	return (Meteor.userId());
};

Template.createGroup.events({
	'click button.btnCreateGroup' : function(){
		var title = document.getElementById('newThreadTitle').value;
		var content = document.getElementById('txtContent').value;
		var groups = $('#groupSelect').val();
		Meteor.call("createGroup", title, content, function(err, data) {
			groupsSubscription = Meteor.subscribe("groups");
			Meteor.Router.to('/groups/' + data);
		});
	}
})