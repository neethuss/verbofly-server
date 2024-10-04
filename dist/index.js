"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./Routes/User/userRoute"));
const adminRoute_1 = __importDefault(require("./Routes/Admin/adminRoute"));
const countryRoute_1 = __importDefault(require("./Routes/Admin/countryRoute"));
const languageRoute_1 = __importDefault(require("./Routes/Admin/languageRoute"));
const categoryRoute_1 = __importDefault(require("./Routes/Admin/categoryRoute"));
const lessonRoute_1 = __importDefault(require("./Routes/Admin/lessonRoute"));
const quizRoute_1 = __importDefault(require("./Routes/Admin/quizRoute"));
const chatRoute_1 = __importDefault(require("./Routes/User/chatRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, dbConfig_1.default)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/api/', userRoute_1.default);
app.use('/admin/', adminRoute_1.default);
app.use('/country/', countryRoute_1.default);
app.use('/language/', languageRoute_1.default);
app.use('/category/', categoryRoute_1.default);
app.use('/lesson/', lessonRoute_1.default);
app.use('/chat/', chatRoute_1.default);
app.use('/quiz/', quizRoute_1.default);
const userSocketMap = new Map();
io.on('connection', (socket) => {
    socket.on('user_connected', (userId) => {
        // console.log('User connected:', userId);
        userSocketMap.set(userId, socket.id);
    });
    socket.on('join chat', (chatData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatId } = chatData;
            if (chatId) {
                socket.join(`chat_${chatId}`);
                // console.log(`User joined chat ${chatId}`);
            }
            else {
                console.error("Chat ID is missing");
            }
        }
        catch (error) {
            console.error("Error in join chat:", error);
        }
    }));
    socket.on('chat message', (messageData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log('chat message', messageData);
            const { chatId, senderId, receiverId, image, audio, call, messageText, createdAt } = messageData;
            if (chatId && senderId && receiverId && createdAt || messageText || image || audio) {
                const receiverSocketId = userSocketMap.get(receiverId);
                io.to(receiverSocketId).emit('chat message', { chatId, senderId, image, messageText, audio, call, createdAt });
            }
            else {
                console.error("Message data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in chat message:", error);
        }
    }));
    socket.on('call', (participants) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('call in backen');
        try {
            const { caller, receiver } = participants;
            console.log(participants, 'call');
            if (participants) {
                console.log('incomingCall');
                const receiverSocketId = userSocketMap.get(receiver._id);
                console.log(receiverSocketId, 'sp');
                io.to(receiverSocketId).emit('incomingCall', { caller, receiver });
            }
            else {
                console.error("Call data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in calling:", error);
        }
    }));
    socket.on('hangupDuringInitiation', (ongoingCall) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Hangup during initiation event received:', ongoingCall);
            const { participants } = ongoingCall;
            if (participants && participants.caller && participants.receiver) {
                const receiverSocketId = userSocketMap.get(participants.caller._id);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('callCancelled', { message: 'The caller has cancelled the call.' });
                }
                console.log(`Call cancelled by ${participants.receiver._id} to ${participants.caller._id}`);
            }
            else {
                console.error("Hangup during initiation data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in hangup during initiation event:", error);
        }
    }));
    socket.on('webrtcSignal', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data, 'webrtcSignal data');
        if (data.isCaller) {
            if (data.ongoingCall.participants.receiver._id) {
                const emitSocketId = userSocketMap.get(data.ongoingCall.participants.receiver._id);
                io.to(emitSocketId).emit('webrtcSignal', data);
            }
        }
        else {
            if (data.ongoingCall.participants.caller._id) {
                const emitSocketId = userSocketMap.get(data.ongoingCall.participants.caller._id);
                io.to(emitSocketId).emit('webrtcSignal', data);
            }
        }
    }));
    socket.on('hangup', (ongoingCall) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
            else {
                console.error("Hangup data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in hangup event:", error);
        }
    }));
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server is connected at ${port}`);
});
