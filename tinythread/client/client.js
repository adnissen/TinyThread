Threads = new Meteor.Collection("threads")
threadsSubscription = Meteor.subscribe("threads");	
directorySubscription = Meteor.subscribe("directory");

Template.hello.greeting = function () {
    return "Welcome to tinythread.";
  };

Template.hello.thread = function() {
	return Threads.find();
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });