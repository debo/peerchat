var isActive = false;
var name  = localStorage.getItem("name");

if(name != "null")
{
  document.getElementById("username").value = name;
}

var pubnub = new PubNub({
    publishKey : 'pub-c-cc4e3ba0-5e0c-40eb-802d-86a052ec5c18',
    subscribeKey : 'sub-c-8ee1ab14-f0ec-11e6-99a6-02ee2ddab7fe'
});

function onKeyPress(e)
{
  if (e.keyCode == 13) {
    send();
    return false;
  }
}

function send() {
  var name = document.getElementById("username").value;
  var publishConfig = {
        channel : "chat",
        message : {
          name: name,
          message: document.getElementById("message").value }
  };

  document.getElementById("message").value = null;
  localStorage.setItem("name", name);
  pubnub.publish(publishConfig, function(status, response) {

  });
};

function renderMessage(event)
{
  var paragraph = document.createElement("p");
  var paragraphText = document.createTextNode(event.message);
  var name = document.createElement("b");
  var nameText = document.createTextNode(event.name + ": ");
  name.appendChild(nameText);
  paragraph.appendChild(name);
  paragraph.appendChild(paragraphText);
  emojify.run(paragraph);
  document.getElementById("thread").appendChild(paragraph);
  var thread = document.getElementById("thread");
  thread.scrollTop = thread.scrollHeight;
}

function renderNotification(event) {
  if(!isActive)
  {
    var notification = new Notification('Message from ' + event.name, {
        body: event.message
    });

    notification.onclick = function () {
      window.focus();
    };
  }
}

pubnub.history(
    {
        channel : 'chat',
        count : 100
    },
    function(status, response){
        _.each(response.messages, function(message) {
          renderMessage(message.entry);
        });
    }
);

pubnub.addListener({
      status: function(statusEvent) {

      },
      message: function(event) {
        renderMessage(event.message);
        renderNotification(event.message);
      },
      presence: function(presenceEvent) {

      }
});

pubnub.subscribe({
    channels: ['chat']
});

if (Notification.permission !== "granted")
{
    Notification.requestPermission(function (status) {
      Notification.permission = status;
    });
}

window.onfocus = function () {
  isActive = true;
};

window.onblur = function () {
  isActive = false;
};
