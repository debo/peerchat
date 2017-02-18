var isOnScreen = false;
var id  = localStorage.getItem("id");
var name = localStorage.getItem("name");

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

window.onload = function() {
  isOnScreen = true;
  sendStatusUpdate("online");
}

window.onfocus = function () {
  isOnScreen = true;
  sendStatusUpdate("online");
};

window.onblur = function () {
  isOnScreen = false;
  sendStatusUpdate("away");
};

window.onbeforeunload = function () {
  isOnScreen = false;
  sendStatusUpdate("offline");
};
