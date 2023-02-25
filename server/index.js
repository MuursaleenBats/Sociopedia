import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import {register} from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";

// CONFIGURATIONs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename:function(req,file,cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

// ROUTES WITH FILES
// /auth/register is the route, upload.single() is the middleware, register is the controller or the logic
app.post("/auth/register", upload.single("picture"), register);  


// ROUTES
app.use("/auth", authRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect("mongodb+srv://dummyuser:" + process.env.MONGO_PASS + 
"@cluster0.pmngcrn.mongodb.net/?retryWrites=true&w=majority", {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
