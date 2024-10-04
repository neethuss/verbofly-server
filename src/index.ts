import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDb from './config/dbConfig';
import cors from 'cors';
import UserRoutes from './Routes/User/userRoute';
import AdminRoutes from './Routes/Admin/adminRoute';
import CountryRoutes from './Routes/Admin/countryRoute';
import LanguageRoutes from './Routes/Admin/languageRoute';
import CategoryRoutes from './Routes/Admin/categoryRoute';
import LessonRoutes from './Routes/Admin/lessonRoute';
import QuizRoutes from './Routes/Admin/quizRoute'
import ChatRoutes from './Routes/User/chatRoute'
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();
connectDb();

const port = process.env.PORT || 3002;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["https://www.verbofly.life/", "https://verbofly.life/", "http://localhost:3000"],
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', UserRoutes);
app.use('/admin/', AdminRoutes);
app.use('/country/', CountryRoutes);
app.use('/language/', LanguageRoutes);
app.use('/category/', CategoryRoutes);
app.use('/lesson/', LessonRoutes);
app.use('/chat/', ChatRoutes);
app.use('/quiz/', QuizRoutes)

app.get('/', (req, res)=> {
  res.send('hai ')
})
const userSocketMap = new Map();

io.on('connection', (socket) => {

  socket.on('user_connected', (userId) => {
    // console.log('User connected:', userId);
    userSocketMap.set(userId, socket.id);
    
  });


  socket.on('join chat', async (chatData) => {
    try {
      const { chatId} = chatData;
      if (chatId) {
        socket.join(`chat_${chatId}`);
        // console.log(`User joined chat ${chatId}`);
      } else {
        console.error("Chat ID is missing");
      }
    } catch (error) {
      console.error("Error in join chat:", error);
    }
  });

  socket.on('chat message', async (messageData) => {
    try {
      // console.log('chat message', messageData);
      const { chatId, senderId, receiverId,image,audio,call, messageText, createdAt } = messageData;
      if (chatId && senderId && receiverId  && createdAt || messageText || image || audio) {
        const receiverSocketId = userSocketMap.get(receiverId);
          io.to(receiverSocketId).emit('chat message', { chatId, senderId,image, messageText, audio, call ,createdAt});
      } else {
        console.error("Message data is incomplete");
      }
    } catch (error) {
      console.error("Error in chat message:", error);
    }
  });

  


  socket.on('call', async (participants) => {
    console.log('call in backen')
    try {
      const { caller, receiver} = participants;
      console.log(participants,  'call');
      if (participants) { 
        console.log('incomingCall')
        const receiverSocketId = userSocketMap.get(receiver._id);
        console.log(receiverSocketId,'sp')
        io.to(receiverSocketId).emit('incomingCall', {caller,receiver });
      } else {
        console.error("Call data is incomplete");
      }
    } catch (error) {
      console.error("Error in calling:", error);
    }
  });


  socket.on('hangupDuringInitiation', async (ongoingCall) => {
    try {
      console.log('Hangup during initiation event received:', ongoingCall);
      const { participants } = ongoingCall;
      
      if (participants && participants.caller && participants.receiver) {
        const receiverSocketId = userSocketMap.get(participants.caller._id);
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('callCancelled', { message: 'The caller has cancelled the call.' });
        }
        console.log(`Call cancelled by ${participants.receiver._id} to ${participants.caller._id}`);
      } else {
        console.error("Hangup during initiation data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup during initiation event:", error);
    }
  });

  socket.on('webrtcSignal', async (data) => {
    console.log(data,'webrtcSignal data')
    if(data.isCaller){
      if(data.ongoingCall.participants.receiver._id){
        const emitSocketId = userSocketMap.get(data.ongoingCall.participants.receiver._id);
        io.to(emitSocketId).emit('webrtcSignal',data)
      }
    }else{
      if(data.ongoingCall.participants.caller._id){
        const emitSocketId = userSocketMap.get(data.ongoingCall.participants.caller._id);
        io.to(emitSocketId).emit('webrtcSignal',data)
      }
    }
  });

  socket.on('hangup', async (ongoingCall) => {
    try {
      console.log('Hangup event received:', ongoingCall);
      const { participants } = ongoingCall;
      
      if (participants && participants.caller && participants.receiver) {
        const otherParticipantId = socket.id === userSocketMap.get(participants.caller._id) 
          ? participants.receiver._id 
          : participants.caller._id;
        
        const otherParticipantSocketId = userSocketMap.get(otherParticipantId);
        
        if (otherParticipantSocketId) {
          io.to(otherParticipantSocketId).emit('callEnded', { message: 'The other participant has ended the call.' });
        }
        console.log(`Call ended between ${participants.caller._id} and ${participants.receiver._id}`);
      } else {
        console.error("Hangup data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup event:", error);
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is connected at ${port}`);
});




