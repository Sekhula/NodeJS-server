const app = require('express')();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 4320; 

const io = require('socket.io')(http, {
  cors: {
    origins: ['*']
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(`${PORT}`, () => {
  console.log(`listening on *:${PORT}`);
});