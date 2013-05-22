Threads = new Meteor.Collection("threads")
threadsSubscription = Meteor.subscribe("threads");	
directorySubscription = Meteor.subscribe("directory");

Template.threadView.thread = function() {
  var threadId = Session.get('currentThreadId');
	return Threads.find({_id: threadId});
  };

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});