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
        message : document.getElementById("message").value
  };

  document.getElementById("message").value = null;

  pubnub.publish(publishConfig, function(status, response) {

  });
};

pubnub.addListener({
      status: function(statusEvent) {

      },
      message: function(event) {
        var node = document.createElement("p");
        var textnode = document.createTextNode(event.message);
        node.appendChild(textnode);
        document.getElementById("thread").appendChild(node);
      },
      presence: function(presenceEvent) {

      }
});

pubnub.subscribe({
    channels: ['chat']
});
