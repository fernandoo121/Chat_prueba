const name_input = document.getElementById("name_input");
const chat_window = document.getElementById("chat_window");
const message_input = document.getElementById("message_input");

const client_id = "chat_client" + Math.random();

const options = {
    connectTimeout: 4000,

    //Autentication
    clientId: client_id,
    username: 'testuser',
    password: '121212',
    keepalive: 60,
    clean: true,
}
const WebSocket_URL = 'ws://iotemperature.online:8083/mqtt'

const client = mqtt.connect(WebSocket_URL, options)

client.on('connect', () =>{
    console.log('Connect success')
    client.subscribe("chat", function (err){
        if(!err){
            console.log("SUSCRIBE SUCCESS");
        }else{
            console.log("SUSCRIBE ERROR");
        }
    });
});

client.on('reconnect', (error) =>{
    console.log('Reconecting:', error)
})

client.on('error', (error) =>{
    console.log('Connect Error', error)
})

client.on('message', function(topic, message){
    console.log("el topic es " + topic + "y el mensaje es " + message.toString());

    const received = JSON.parse(message.toString());

    if(received.name.trim() == name_input.value.trim()){
        chat_window.innerHTML = chat_window.innerHTML + '<div style=color:red"> <b>' + received.msg + '</b></div>'
    }else{
        chat_window.innerHTML = chat_window.innerHTML + '<div style="color:grey"><i> ' + received.name + ': </i>' + received.msg + '</div>';
    }
    chat_window.scrollTop = chat_window.scrollHeight;
});

message_input.addEventListener('keyup', function (e){
    if(e.key === 'Enter' || e.keyCode === 13){

        if(name_input.value == ""){
            chat_window.innerHTML = chat_window.innerHTML + '<div style="color:blue"> <b> Falta poner nombre :(</b> </div';
            return;
        }

        const to_send = {
            name:name_input.value,
            msg: message_input.value,
        }
        
        console.log(JSON.stringify(to_send));
        client.publish("chat", JSON.stringify(to_send));

        message_input.value = "";

    }
});