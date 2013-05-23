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
  return Replies.find({parent: threadId}, {sort: {time: 1}});
};

Template.threadView.loggedAndAuthed = function() {
  var threadId = Session.get('currentThreadId');
  if (Meteor.user() != null && Meteor.user().authList.indexOf(threadId) > -1)
    return true;
};

Template.threadView.events({
  'click button.btnReply' : function(){
    Meteor.call("addReply", Session.get('currentThreadId'), document.getElementById('txtContent').value);
    document.getElementById('txtContent').value = "";
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});