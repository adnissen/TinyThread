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

Template.threadView.selected = function() {
  if (Meteor.userId() != null)
  {
    if (Session.get("selectedReply") == this._id)
      return true;
    else
      return false;
  }
};

Template.threadView.owner = function() {
  if (Meteor.userId())
  {
    var threadId = Session.get('currentThreadId');
    var thread = Threads.findOne({_id: threadId});
    return (thread.owner_id == Meteor.userId());
  }
};

Template.threadView.events({
  'click button.btnReply' : function(){
    Meteor.call("addReply", Session.get('currentThreadId'), document.getElementById('txtContent').value);
    document.getElementById('txtContent').value = "";
  },

  'click div.reply' : function(){
    if (Meteor.userId() != null && Meteor.userId() == Replies.findOne({_id: this._id}).owner_id)
    {
      if (Session.get("selectedReply") != this._id)
        Session.set("selectedReply", this._id);
      else
        Session.set("selectedReply", null);
    }
  },

  'click a.delete' : function() {
    Meteor.call("deleteReply", this._id);
    Session.set("selectedReply", null);
  },

  'click button.btnDeleteThread' : function() {
    var threadId = Session.get('currentThreadId');
    Meteor.call("deleteThread", threadId, function(err, data){
      Meteor.Router.to("/");
    });
  },

  'click button.btnUnSub' : function() {
    var threadId = Session.get('currentThreadId');
    Meteor.call("leaveThread", threadId, function(err, data){
      threadsSubscription = Meteor.subscribe("threads");
      repliesSubscription = Meteor.subscribe("replies");
      groupsSubscription = Meteor.subscribe("groups");
      Meteor.Router.to("/");
    });
  }
});

Template.threadView.events(okCancelEvents('#invite', {
  ok: function(text, evt){
    var threadId = Session.get('currentThreadId');
    var username = document.getElementById('invite').value;
    Meteor.call("authUser", threadId, username);
    document.getElementById('invite').value = "";
  }
}));