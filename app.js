const path = require('path');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

//Defines the framework used to mount the server and manipulate user requests
const express = require('express');

const bodyParser = require('body-parser');
const watson = require('./config.json');
const app = express();
app.use(bodyParser.json());

//Tells Express where to find static content
app.use(express.static('./assets'));

//Sets the port.
const port = 3000;

//Defines the credencials of api
const assistant = new AssistantV1({
  username: watson.username,
  password: watson.password,
  url: watson.url,
  version: '2018-02-16',
});

//Assemble the requisition
app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id: watson.workspace_id,
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  });
});

//Defines the root route of the application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/src/index.html'));
})

//Starts a UNIX socket and listens for the connection in the path provided
app.listen(port, () => console.log(`Running on port ${port}`));