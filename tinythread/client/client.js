Threads = new Meteor.Collection("threads");
Replies = new Meteor.Collection("replies");
threadsSubscription = Meteor.subscribe("threads");	
repliesSubscription = Meteor.subscribe("replies");
directorySubscription = Meteor.subscribe("directory");

Template.threadView.thread = function() {
  var threadId = Session.get('currentThreadId');
	return Threads.find({_id: threadId});
  };

Template.threadView.reply = function() {
  var threadId = Session.get('currentThreadId');
  return Replies.find({parent: threadId});
};

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});