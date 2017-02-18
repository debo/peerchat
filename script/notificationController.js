function renderNotification(event) {
  if(!isOnScreen)
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

if (Notification.permission !== "granted")
{
    Notification.requestPermission(function (status) {
      Notification.permission = status;
    });
}
