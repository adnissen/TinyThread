Threads = new Meteor.Collection("threads");
Replies = new Meteor.Collection("replies");
Groups = new Meteor.Collection("groups");
threadsSubscription = Meteor.subscribe("threads");	
repliesSubscription = Meteor.subscribe("replies");
groupsSubscription = Meteor.subscribe("groups");
directorySubscription = Meteor.subscribe("directory");

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});