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
  var publishConfig = {
        channel : "chat",
        message : {
          name: document.getElementById("username").value,
          message: document.getElementById("message").value }
  };

  document.getElementById("message").value = null;

  pubnub.publish(publishConfig, function(status, response) {

  });
};

pubnub.addListener({
      status: function(statusEvent) {

      },
      message: function(event) {
        var paragraph = document.createElement("p");
        var paragraphText = document.createTextNode(event.message.message);
        var name = document.createElement("b");
        var nameText = document.createTextNode(event.message.name + ": ");
        name.appendChild(nameText);
        paragraph.appendChild(name);
        paragraph.appendChild(paragraphText);
        document.getElementById("thread").appendChild(paragraph);

        var thread = document.getElementById("thread");
        thread.scrollTop = thread.scrollHeight;

      },
      presence: function(presenceEvent) {

      }
});

pubnub.subscribe({
    channels: ['chat']
});
