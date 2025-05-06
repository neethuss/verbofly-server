import express from 'express';
import passport from 'passport';
import session from 'express-session'
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
import ConnectionRoutes from './Routes/User/connectionRoute'
import SubscriptionRoutes from './Routes/Admin/subscriptionRoute'
import GoogleAuthRoutes from './Routes/User/googleAuthRoute'
import ForgotPasswordRoutes from './Routes/User/forgotPasswordRoute'
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan'
import fs from 'fs'

dotenv.config();
connectDb();

const port = process.env.PORT || 3002;

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://www.verbofly.life", "https://verbofly.life", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
  }
});


app.use(cors({
  origin: ["https://www.verbofly.life", "https://verbofly.life", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(morgan('dev'))

app.use('/api/', UserRoutes);
app.use('/admin/', AdminRoutes);
app.use('/country/', CountryRoutes);
app.use('/language/', LanguageRoutes);
app.use('/category/', CategoryRoutes);
app.use('/lesson/', LessonRoutes);
app.use('/chat/', ChatRoutes);
app.use('/quiz/', QuizRoutes)
app.use('/subscription/', SubscriptionRoutes)
app.use('/connection/', ConnectionRoutes)
app.use('/forgotPassword', ForgotPasswordRoutes)

app.use('/googleauth', GoogleAuthRoutes)


app.get('/', (req, res) => {
  res.send('hai ')
})
const userSocketMap = new Map();

io.on('connection', (socket) => {

  socket.on('user_connected', (userId) => {
    userSocketMap.set(userId, socket.id);

  });


  socket.on('join chat', async (chatData) => {
    try {
      const { chatId } = chatData;
      if (chatId) {
        socket.join(`chat_${chatId}`);
      } else {
        console.error("Chat ID is missing");
      }
    } catch (error) {
      console.error("Error in join chat:", error);
    }
  });

  socket.on('chat message', async (messageData) => {
    try {
      const { chatId, senderId, receiverId, image, audio, call, messageText, createdAt } = messageData;
      if (chatId && senderId && receiverId && createdAt || messageText || image || audio) {
        const receiverSocketId = userSocketMap.get(receiverId);
        io.to(receiverSocketId).emit('chat message', { chatId, senderId, image, messageText, audio, call, createdAt });
      } else {
        console.error("Message data is incomplete");
      }
    } catch (error) {
      console.error("Error in chat message:", error);
    }
  });




  socket.on('call', async (participants) => {
    try {
      const { caller, receiver } = participants;
      if (participants) {
        const receiverSocketId = userSocketMap.get(receiver._id);
        io.to(receiverSocketId).emit('incomingCall', { caller, receiver });
      } else {
        console.error("Call data is incomplete");
      }
    } catch (error) {
      console.error("Error in calling:", error);
    }
  });


  socket.on('hangupDuringInitiation', async (ongoingCall) => {
    try {
      const { participants } = ongoingCall;
  
      if (participants && participants.caller && participants.receiver) {
        const receiverSocketId = userSocketMap.get(participants.receiver._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('callCancelled', { 
            message: 'The caller has cancelled the call.' 
          });
        }
        
        const callerSocketId = userSocketMap.get(participants.caller._id);
        if (callerSocketId) {
          io.to(callerSocketId).emit('callCancelled', { 
            message: 'Call has been cancelled.' 
          });
        }
        
      } else {
        console.error("Hangup during initiation data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup during initiation event:", error);
    }
  });

  socket.on('webrtcSignal', async (data) => {
    if (data.isCaller) {
      if (data.ongoingCall.participants.receiver._id) {
        const emitSocketId = userSocketMap.get(data.ongoingCall.participants.receiver._id);
        io.to(emitSocketId).emit('webrtcSignal', data)
      }
    } else {
      if (data.ongoingCall.participants.caller._id) {
        const emitSocketId = userSocketMap.get(data.ongoingCall.participants.caller._id);
        io.to(emitSocketId).emit('webrtcSignal', data)
      }
    }
  });

  socket.on('hangup', async (ongoingCall) => {
    try {
      const { participants } = ongoingCall;

      if (participants && participants.caller && participants.receiver) {
        const otherParticipantId = socket.id === userSocketMap.get(participants.caller._id)
          ? participants.receiver._id
          : participants.caller._id;

        const otherParticipantSocketId = userSocketMap.get(otherParticipantId);

        if (otherParticipantSocketId) {
          io.to(otherParticipantSocketId).emit('callEnded', { message: 'The other participant has ended the call.' });
        }
      } else {
        console.error("Hangup data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup event:", error);
    }
  });

  socket.on('sent connection request', async ( receiverId,userId, username ) => {
    try {
      if (receiverId) {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('connectionRequestReceived',  userId,username );
        } else {
          console.error("Receiver socket not found");
        }
      } else {
        console.error("Receiver Id is not available");
      }
    } catch (error) {
      console.error("Error in sent connection request:", error);
    }
  });


  socket.on('accept connetion request', async ( receiverId, userId, username ) => {
    try {
      if (receiverId) {
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('connectionRequestAccepted', userId,username );
        } else {
          console.error("Receiver socket not found");
        }
      } else {
        console.error("Receiver Id is not available");
      }
    } catch (error) {
      console.error("Error in accept connetion request:", error);
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is connected at ${port}`);
});




