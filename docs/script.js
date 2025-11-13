commands = "gergo/audio.json"

function startConnect(){
    clientID = "clientID - "+parseInt(Math.random() * 100);
    host = "broker.hivemq.com";   
    port = "8081";  
    //port = "1883";
    //userId  = document.getElementById("username").value;  
    //passwordId = document.getElementById("password").value;  

    client = new Paho.MQTT.Client(host,Number(port),clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        'useSSL': true,
        'onSuccess': onConnect
    });
}

function onConnect(){
    topic =  "gergo/"+ document.getElementById("topic_s").value;
    document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";
    client.subscribe(topic);
}

function onConnectionLost(responseObject){
    document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
    if(responseObject !=0){
        document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
    }
}

function onMessageArrived(message){
    //console.log("OnMessageArrived: "+message.payloadString);
    if(message.destinationName != "carpenters_robot/img"){
      console.log(`Message received: ${message.payloadString}`);
      document.getElementById("messages").innerHTML += "Topic:"+message.destinationName+"| Message : "+message.payloadString + "<br>";
    }
    else if (message.destinationName == "carpenters_robot/img"){
      document.getElementById("messages").innerHTML += "Topic:"+message.destinationName+"| Message : hey<br>";
      console.log(`Hey`);
      
      var payload = message.payloadBytes
      var length = payload.length;
      var buffer = new ArrayBuffer(length);
      uint = new Uint8Array(buffer);
      for (var i=0; i<length; i++) {
        uint[(length-1)-i] = payload[i];
      }
      var doubleView = new Float64Array(uint.buffer);
      var number = doubleView[0];
      console.log("onMessageArrived:"+number);
      
      
      // Convert the message (byte array) to a Blob
      const blob = new Blob([message.payloadString], { type: 'image/jpeg' });
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      // Set the src of the image element
      document.getElementById('image').src = url;

    }
}

function startDisconnect(){
    client.disconnect();
    document.getElementById("messages").innerHTML += "<span> Disconnected. </span><br>";
}

function publishMessage(){
msg_raw = document.getElementById("Message").value
msg =   document.getElementById("topic_secret").value + msg_raw
topic = "carpenters_robot/"+ document.getElementById("topic_p").value;

Message = new Paho.MQTT.Message(msg);
Message.destinationName = topic;
client.send(Message);
document.getElementById("messages").innerHTML += "Message: "+msg_raw+" to topic "+topic+" is sent<br>";
}

//robot buttons
function play(){
  msg = 'PLAY';
  topic = commands;
  Message = new Paho.MQTT.Message(msg);
  Message.destinationName = topic;
  client.send(Message);
  document.getElementById("messages").innerHTML += "Playing...";
  }

// //toggle switch
// document.addEventListener('DOMContentLoaded', function () {
//     var checkbox = document.querySelector('input[type="checkbox"]');
  
//     checkbox.addEventListener('change', function () {
//       if (checkbox.checked) {
//         // do this
//         console.log('Checked');
//       } else {
//         // do that
//         console.log('Not checked');
//       }
//     });
//   });


//keep with end of scroling
//document.getElementById('scrollit').scrollTop = 9999999;


function sliderValue(){
    var slider = document.getElementById("slider");
    var output = document.getElementById("slider_value");
    output.innerHTML = slider.value; // Display the default slider value
    slider.oninput = function() {
      output.innerHTML = this.value;
    }
    // Update the current slider value (each time you drag the slider handle)
    slider.onchange = function() {
      msg_raw = this.value;
      msg =   document.getElementById("topic_secret").value + msg_raw
      topic = "carpenters_robot/speed";
      Message = new Paho.MQTT.Message(msg_raw);
      Message.destinationName = topic;
      client.send(Message);
      document.getElementById("messages").innerHTML += "Message:"+msg_raw+" to topic "+topic+" is sent<br>";
    }

}
