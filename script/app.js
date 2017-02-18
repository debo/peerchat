var isActive = false;
var id  = localStorage.getItem("id");
var name = localStorage.getItem("name");

var pubnub = new PubNub({
    publishKey : 'pub-c-cc4e3ba0-5e0c-40eb-802d-86a052ec5c18',
    subscribeKey : 'sub-c-8ee1ab14-f0ec-11e6-99a6-02ee2ddab7fe'
});

if(validValue(name))
{
  document.getElementById("username").value = name;
}

if(!validValue(id))
{
  id = generateGuid();
  localStorage.setItem("id",id);
}

function validValue(value)
{
  if(value != null &&
      value != "null" &&
      value != undefined &&
      value != "undefined")
      {
        return true;
      }else {
        return false;
      }
}

function generateGuid()
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}

function onKeyPress(e)
{
  if (e.keyCode == 13) {
    send();
    return false;
  }
}

function insertEmoji(element)
{
  var textArea = document.getElementById("message");
  var message = textArea.value;
  message += element.innerText;
  textArea.value = message;
  textArea.focus();
}

function send() {
  var name = document.getElementById("username").value;
  var publishConfig = {
        channel : "chat.default",
        message : {
          id: id,
          name: name,
          message: document.getElementById("message").value
        }
  };

  document.getElementById("message").value = '';
  localStorage.setItem("name", name);
  pubnub.publish(publishConfig, function(status, response) {

  });
};

function renderMessage(event)
{
  var container = document.createElement("div");
  var paragraph = document.createElement("p");
  var paragraphText = document.createTextNode(event.message);

  if(id == event.id)
  {
    container.className += "sent";
  }else{
    var name = document.createElement("b");
    var nameText = document.createTextNode(event.name + ": ");
    name.appendChild(nameText);
    paragraph.appendChild(name);
    container.className += "received";
  }

  paragraph.appendChild(paragraphText);
  container.appendChild(paragraph);
  document.getElementById("thread").appendChild(container);
  var thread = document.getElementById("thread");
  thread.scrollTop = thread.scrollHeight;
}

function renderNotification(event) {
  if(!isActive)
  {
    var notification = new Notification('Message from ' + event.name, {
        icon: 'images/user_icon.png',
        sound: 'sounds/alert.mp3',
        body: event.message
    });

    notification.onclick = function () {
      window.focus();
    };
  }
}

pubnub.history(
    {
        channel : 'chat.default',
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
    channels: ['chat.default','user.status']
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

window.onbeforeunload = function () {

};
