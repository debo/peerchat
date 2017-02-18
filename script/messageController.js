var pubnub = new PubNub({
    publishKey: 'pub-c-cc4e3ba0-5e0c-40eb-802d-86a052ec5c18',
    subscribeKey: 'sub-c-8ee1ab14-f0ec-11e6-99a6-02ee2ddab7fe'
});

pubnub.history({
        channel: 'chat.default',
        count: 100
    },
    function(status, response) {
        _.each(response.messages, function(message) {
            renderMessage(message.entry);
        });
    }
);

pubnub.addListener({
    status: function(statusEvent) {

    },
    message: function(event) {
        switch (event.channel) {
            case "chat.default":
                renderMessage(event.message);
                renderNotification(event.message);
                break;
            case "user.status":
                renderStatusUpdate(event.message);
                break;
        }

    },
    presence: function(presenceEvent) {

    }
});

pubnub.subscribe({
    channels: ['chat.default', 'user.status']
});

function renderMessage(event) {
    var container = document.createElement("div");
    var paragraph = document.createElement("p");
    var paragraphText = document.createTextNode(event.message);

    if (id == event.id) {
        container.className += "sent";
    } else {
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

function renderStatusUpdate(statusUpdate) {
    if (statusUpdate.id == id) {
        return;
    }

    var userItem = document.getElementById(statusUpdate.id);
    var userList = document.getElementById("user-list");

    if (statusUpdate.status == "offline" && userItem != null) {
        userList.removeChild(userItem);
    }

    if (userItem == null) {
        var newUserItem = document.createElement("li");
        newUserItem.setAttribute("id", statusUpdate.id);
        userItem = newUserItem;
        userList.appendChild(userItem);
    }

    userItem.className = statusUpdate.status;
    userItem.innerText = statusUpdate.name;

    if (statusUpdate.status == "typing") {
        setTimeout(function() {
            userItem.className = "online";
        }, 2000);
    }
}

function sendStatusUpdate(status) {

    if (name == null || name == "null") {
        return;
    }

    var publishConfig = {
        channel: "user.status",
        message: {
            id: id,
            name: name,
            status: status
        }
    };

    pubnub.publish(publishConfig, function(status, response) {

    });
}

function sendMessage() {
    name = document.getElementById("username").value;
    var publishConfig = {
        channel: "chat.default",
        message: {
            id: id,
            name: name,
            message: document.getElementById("message").value
        }
    };

    document.getElementById("message").value = '';
    localStorage.setItem("name", name);
    pubnub.publish(publishConfig, function(status, response) {

    });
    sendStatusUpdate("online");

}
