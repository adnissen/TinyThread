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