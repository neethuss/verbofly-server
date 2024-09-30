"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./Routes/User/userRoute"));
const adminRoute_1 = __importDefault(require("./Routes/Admin/adminRoute"));
const countryRoute_1 = __importDefault(require("./Routes/Admin/countryRoute"));
const languageRoute_1 = __importDefault(require("./Routes/Admin/languageRoute"));
const categoryRoute_1 = __importDefault(require("./Routes/Admin/categoryRoute"));
const lessonRoute_1 = __importDefault(require("./Routes/Admin/lessonRoute"));
const bodyParser = require("body-parser");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, dbConfig_1.default)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(bodyParser.json());
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
app.listen(process.env.PORT, () => {
    console.log(`Server is connected at ${port}`);
});
