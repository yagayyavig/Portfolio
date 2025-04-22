"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./middleware/passport"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.static("public"));
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // HTTPS Required
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
const router = express_1.default.Router();
const indexRoute_1 = __importDefault(require("./routers/indexRoute"));
const authRoute_1 = __importDefault(require("./routers/authRoute"));
const postRouters_1 = __importDefault(require("./routers/postRouters"));
const subsRouters_1 = __importDefault(require("./routers/subsRouters"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/auth", authRoute_1.default);
app.use("/posts", postRouters_1.default);
app.use("/subs", subsRouters_1.default);
app.use("/", indexRoute_1.default);
app.use("/web2", router);
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}/`));
//# sourceMappingURL=app.js.map