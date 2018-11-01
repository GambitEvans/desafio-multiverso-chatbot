//Instantiates the elements to be manipulated.
const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');
const button = document.getElementById('button'); 

let context = {};

//Inserts in the DIV the message, the time and sender.
const templateChatMessage = (message, hour, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p id="msg">${message}</p>
      <p id="hour">${hour}</p>
    </div>
  </div>
  `;

//Inserts the div mounted in the chat.
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);

  scrollToEndChat(chat);
};

//Mount a request, pick up the server's response and put it in the chat.
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'http://localhost:3000/conversation/';

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;

  const template = templateChatMessage(response.output.text, hourFormatter(), 'watson');

  InsertTemplateInTheChat(template);
};

//Verifies that the enter has been triggered and if there is text in the field to then send the message
//to the server pick up the response and put it in the chat.
textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    putMessagesInTheChat();
  }
});

//Check if the button was clicked and if there is text in the field then send the message 
//to the server pick up the response and put it in the chat.
button.addEventListener('click', (event) => {  
  if (textInput.value) {
    putMessagesInTheChat();
  }	
});

function putMessagesInTheChat(){
  getWatsonMessageAndInsertTemplate(textInput.value);

  const template = templateChatMessage(textInput.value, hourFormatter(), 'user');
  InsertTemplateInTheChat(template);
  
  textInput.value = '';  
}

//Captures the time the message is being sent/received and formats.
function hourFormatter(){
  var date = new Date();
  var formatedTime = "";
  var hour = date.getHours();
  var min = date.getMinutes();
  formatedTime = hour + ":" + min;
  return formatedTime;	

}

//Keep Chat always on the last message.
function scrollToEndChat(chat) {
  chat.scrollTop = chat.scrollHeight;
}

//Take the greetings from the server.
getWatsonMessageAndInsertTemplate();