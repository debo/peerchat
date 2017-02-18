function insertEmoji(element)
{
  var textArea = document.getElementById("message");
  var message = textArea.value;
  message += element.innerText;
  textArea.value = message;
  textArea.focus();
  sendStatusUpdate("typing");
}

function onKeyPress(e)
{
  if (e.keyCode == 13) {
    sendMessage();
    return false;
  }
  sendStatusUpdate("typing");
}
