Threads = new Meteor.Collection("threads")
threadsSubscription = Meteor.subscribe("threads");	
directorySubscription = Meteor.subscribe("directory");

Template.threadView.thread = function() {
	return Threads.find();
  };