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
const passwordUtils_1 = __importDefault(require("../../utils/passwordUtils"));
const jwtUtils_1 = __importDefault(require("../../utils/jwtUtils"));
const mailUtils_1 = __importDefault(require("../../utils/mailUtils"));
const subscriptionModel_1 = require("../../models/User/subscriptionModel");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    generateSixDigitOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    postSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                console.log('singup', req.body);
                const existingUser = yield this.userService.findByEmail(user.email);
                if (existingUser) {
                    res.status(200).json({ message: "User already exists" });
                }
                else {
                    const hashedPassword = yield passwordUtils_1.default.hashPassword(user.password);
                    user.password = hashedPassword;
                    const newUser = yield this.userService.createUser(user);
                    console.log(newUser, 'new');
                    res.status(201).json(newUser);
                }
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    postLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('backend vann');
                console.log(req.body, 'login body');
                const { email, password } = req.body;
                const { user, message } = yield this.userService.authenticateUser(email, password);
                if (!user) {
                    if (message === 'No user is registered with this email') {
                        res.status(404).json({ message });
                        return;
                    }
                    else if (message === 'Invalid password') {
                        res.status(401).json({ message });
                        return;
                    }
                    else if (message === 'Your account is blocked') {
                        res.status(403).json({ message });
                        return;
                    }
                }
                if ((user === null || user === void 0 ? void 0 : user.isSubscribed) && (user === null || user === void 0 ? void 0 : user.expirationDate)) {
                    const currentDate = new Date();
                    if (currentDate > (user === null || user === void 0 ? void 0 : user.expirationDate)) {
                        user.isSubscribed = false;
                        user.expirationDate = null;
                        yield this.userService.update(user._id, user);
                    }
                }
                console.log('token undakkan pohn');
                const accessToken = jwtUtils_1.default.generateAccessToken({ email: user === null || user === void 0 ? void 0 : user.email });
                const refreshToken = jwtUtils_1.default.generateRefreshToken({ email: user === null || user === void 0 ? void 0 : user.email });
                res.cookie("userRefreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    maxAge: 1 * 60 * 60 * 1000
                });
                console.log('succ');
                res.status(200).json({ message: 'Login successful', accessToken, user });
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    postForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('forgot');
                const { email } = req.body;
                console.log(email, 'istj');
                const existingUser = yield this.userService.findByEmail(email);
                console.log('exist', existingUser);
                if (existingUser) {
                    const otp = this.generateSixDigitOtp();
                    console.log(otp);
                    const mailer = yield mailUtils_1.default.sendOtp(email, otp);
                    console.log(mailer.otp, 'mailer nthuva');
                    res.status(200).json(mailer);
                }
                else {
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    postVerifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('verifying', req.body);
                const { otpString, storedOtp } = req.body;
                console.log(`otpString: ${otpString}, storedOtp: ${storedOtp}`);
                console.log(`otpString type: ${typeof otpString}, storedOtp type: ${typeof storedOtp}`);
                console.log(otpString === storedOtp, 'comparison result');
                if (otpString === storedOtp) {
                    res.status(200).json({ message: 'OTP verified successfully' });
                }
                else {
                    res.status(400).json({ message: 'Invalid OTP' });
                }
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    postResetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('resetting');
                const { email, password } = req.body;
                const user = yield this.userService.findByEmail(email);
                if (user) {
                    console.log('user und');
                    const hashedPassword = yield passwordUtils_1.default.hashPassword(password);
                    console.log('has', hashedPassword);
                    const updatedUser = yield this.userService.update(user._id, { password: hashedPassword });
                    if (updatedUser) {
                        res.status(200).json({ message: 'Password updated successfully' });
                    }
                    else {
                        res.status(400).json({ message: 'Failed to update password' });
                    }
                }
                else {
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const email = req.user;
                    console.log(email, 'clg');
                    const user = yield this.userService.findByEmail(email);
                    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                        res.send(403).json({ Message: 'blocked' });
                        return;
                    }
                    res.status(200).send(user);
                }
            }
            catch (error) {
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get userillum vann');
                if (req.user) {
                    const email = req.user;
                    console.log(email, 'clg');
                    const user = yield this.userService.findByEmail(email);
                    if (!user) {
                        res.status(404).send({ error: 'User not found' });
                        return;
                    }
                    if (user.isBlocked) {
                        res.status(403).send({ error: 'User is blocked' });
                        return;
                    }
                    // console.log(user, 'deat')
                    res.status(200).send(user);
                }
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updage  back');
            try {
                if (!req.user) {
                    res.status(401).send({ error: 'Unauthorized' });
                    return;
                }
                const email = req.user;
                const existingUser = yield this.userService.findByEmail(email);
                if (!existingUser) {
                    res.status(404).send({ error: 'User not found' });
                    return;
                }
                console.log(req.body, 'update user');
                const user = req.body;
                const updatedUser = this.userService.update(existingUser._id, user);
                console.log(updatedUser, 'nthoke updage aayi in backene');
                res.status(200).json(updatedUser);
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    uploadUserImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).json({ message: 'No file uploaded' });
                    return;
                }
                console.log(req.file, 'file back');
                if (!req.user) {
                    res.status(401).send({ message: 'Unauthorized' });
                    return;
                }
                console.log(req.user, 'filuse back');
                const email = req.user;
                const user = yield this.userService.findByEmail(email);
                if (!user) {
                    res.status(404).send({ message: "User not found with this email" });
                    return;
                }
                const fileUrl = req.file.location;
                const imageType = req.query.type;
                if (imageType === 'profile') {
                    user.profilePhoto = fileUrl;
                }
                else {
                    res.status(400).json({ message: 'Invalid image type' });
                    return;
                }
                const updatedUser = yield this.userService.update(user._id, user);
                res.status(200).send();
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('users');
                const { search = '', page = 1, limit = 10 } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const result = yield this.userService.findAll(pageNum, limitNum, search);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: 'Unexpected server error' });
            }
        });
    }
    unblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('unblocking');
                const updatedUser = yield this.userService.update(id, { isBlocked: false });
                if (updatedUser) {
                    console.log(updatedUser, 'update aayi');
                    res.status(200).json(updatedUser);
                }
                else {
                    console.log('Usrene kaanan illa');
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('blocking');
                const updatedUser = yield this.userService.update(id, { isBlocked: true });
                if (updatedUser) {
                    console.log(updatedUser, 'update aayi');
                    res.status(200).json(updatedUser);
                }
                else {
                    console.log('Usrene kaanan illa');
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
                const email = req.user;
                const user = yield this.userService.findByEmail(email);
                const userId = user === null || user === void 0 ? void 0 : user._id;
                const { nativeId } = req.params;
                const nativeUser = yield this.userService.findById(nativeId);
                console.log(user, 'native user');
                let connectionStatus = 'No relation';
                if (nativeUser === null || nativeUser === void 0 ? void 0 : nativeUser.connections.includes(userId)) {
                    connectionStatus = 'Connected';
                }
                else if (nativeUser === null || nativeUser === void 0 ? void 0 : nativeUser.sentRequests.includes(userId)) {
                    connectionStatus = 'Requested';
                }
                else if (nativeUser === null || nativeUser === void 0 ? void 0 : nativeUser.receivedRequests.includes(userId)) {
                    connectionStatus = 'Accept';
                }
                console.log(nativeUser, 'var');
                console.log(connectionStatus, 'conn');
                const result = { nativeUser, connectionStatus };
                res.status(200).send(result);
            }
            catch (error) {
                res.status(500).json({ message: "Unexpected server error" });
            }
        });
    }
    getNativeSpeakers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search = '', page = 1, limit = 10, filterCountry, filterLanguage } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                if (req.user) {
                    const email = req.user;
                    const user = yield this.userService.findByEmail(email);
                    const userId = user === null || user === void 0 ? void 0 : user._id;
                    const result = yield this.userService.findNativeSpeakers(userId, pageNum, limitNum, search, filterLanguage, filterCountry);
                    res.status(200).json(result);
                }
                else {
                    res.status(401).json({ message: 'Unauthorized' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Unexpected server error' });
            }
        });
    }
    sendConnectionRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('sendong req');
                const email = req.user;
                const user = yield this.userService.findByEmail(email);
                const senderId = user === null || user === void 0 ? void 0 : user._id;
                const { receiverId } = req.body;
                if (!senderId || !receiverId) {
                    res.status(400).json({ message: 'Missing sender or receiver ID' });
                    return;
                }
                const result = yield this.userService.sendConnectionRequest(senderId, receiverId);
                console.log(result, 'final ba');
                const connectionStatus = 'Accept';
                const final = { result, connectionStatus };
                if (result) {
                    res.status(200).json({ message: 'Connection request sent', final });
                }
                else {
                    res.status(404).json({ message: 'Sender or receiver not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Unexpected server error' });
            }
        });
    }
    cancelConnectionRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('cancel req');
                const email = req.user;
                const user = yield this.userService.findByEmail(email);
                const senderId = user === null || user === void 0 ? void 0 : user._id;
                const { cancelId } = req.body;
                if (!senderId || !cancelId) {
                    res.status(400).json({ message: 'Missing sender or receiver ID' });
                    return;
                }
                const result = yield this.userService.cancelConnectionRequest(senderId, cancelId);
                console.log(result, 'final ba');
                const connectionStatus = 'Requested';
                const final = { result, connectionStatus };
                if (result) {
                    res.status(200).json({ message: 'Connection request sent', final });
                }
                else {
                    res.status(404).json({ message: 'Sender or receiver not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Unexpected server error' });
            }
        });
    }
    acceptConnectionRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('accept req');
                const email = req.user;
                const user = yield this.userService.findByEmail(email);
                const senderId = user === null || user === void 0 ? void 0 : user._id;
                const { acceptId } = req.body;
                if (!senderId || !acceptId) {
                    res.status(400).json({ message: 'Missing sender or receiver ID' });
                    return;
                }
                const result = yield this.userService.acceptConnectionRequest(senderId, acceptId);
                console.log(result, 'final ba');
                const connectionStatus = 'Requested';
                const final = { result, connectionStatus };
                if (result) {
                    res.status(200).json({ message: 'Connection request sent', final });
                }
                else {
                    res.status(404).json({ message: 'Sender or receiver not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Unexpected server error' });
            }
        });
    }
    updateSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, 'sub body');
                const { email, orderId } = req.body;
                const user = yield this.userService.findByEmail(email);
                if (user) {
                    const userId = user._id;
                    const currentDate = new Date();
                    const expirationdate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
                    const updatedUser = yield this.userService.update(userId, { isSubscribed: true, expirationDate: expirationdate });
                    const subscription = new subscriptionModel_1.Subscription({
                        userId: userId,
                        amount: 199,
                        orderId: orderId,
                        expirationDate: expirationdate
                    });
                    const updateSubscription = yield subscription.save();
                    res.status(200).send(updatedUser);
                }
            }
            catch (error) {
            }
        });
    }
}
exports.default = UserController;
