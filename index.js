import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";
import { createReadStream } from "fs";
import {
	ImageClassification,
	OpticalCharacterRecognition
} from "./nanonets/index.js";
import dotenv from "dotenv";

// Initialization
const app = express();
const upload = multer({ dest: "public/uploads" });
dotenv.config();

// Make "__dirname" available in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files
app.use("/public", express.static(__dirname + "/public"));

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Object invocations
const ocr = new OpticalCharacterRecognition(
	process.env.API_KEY_1,
	process.env.MODEL_ID_1
);
const ic = new ImageClassification(
	process.env.API_KEY_1,
	process.env.MODEL_ID_2
);

// Routes
app.get("/", async (req, res) => {
	// const ocrUrlArray = [process.env.FILE_URL_1, process.env.FILE_URL_2];
	// const icUrlArray = [process.env.FILE_URL_3, process.env.FILE_URL_4];
	// const startInterval = 18917;
	// const endInterval = 18919;

	// console.log(await ocr.getModelDetails());
	// console.log(await ocr.getAllPredictedFileData(startInterval, endInterval));
	// console.log(await ocr.getPredictedFileDataById(process.env.FILE_ID));
	// console.log(await ocr.predictUsingUrls(ocrUrlArray));
	// console.log(await ocr.predictUsingUrlsAsync(urlArray));

	// console.log(await ic.getModelDetails());
	// console.log(await ic.predictUsingUrls(icUrlArray));

	res.sendFile(__dirname + "/public/index.html");
});

app.get("/uploadFile", (req, res) => {
	res.sendFile(__dirname + "/public/fileUpload.html");
});

app.post("/uploadFile", upload.single("file"), async (req, res) => {
	const file = createReadStream(req.file.path);

	if (req.body.operation === "ocr")
		console.log(await ocr.predictUsingFile(file));
	else if (req.body.operation === "ocr-async")
		console.log(await ocr.predictUsingFileAsync(file));
	else if (req.body.operation === "ic")
		console.log(await ic.predictUsingFile(file));

	res.send("Uploaded. Check server console for response.");
});

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
	if (err) console.error("Node.js server error: ", err);
	else console.log(`Server started on port ${PORT}...`);
});
