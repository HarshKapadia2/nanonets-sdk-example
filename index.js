import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";
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

	// Optical Character Recognition (OCR) functions
	// Uncomment specific functions to get an output in the server console.
	/*
		Don't forget to
	 	- Add API Keys, Model IDs and other required data to a `.env` file in the root directory.
		- Uncomment the required Object invocations
	*/

	// console.log(
	// 	await ocr.getModelDetails(),
	// 	"\n-------------------------------------------------------\n"
	// );
	// console.log(
	// 	await ocr.getAllPredictedFileData(startInterval, endInterval),
	// 	"\n-------------------------------------------------------\n"
	// );
	// console.log(
	// 	await ocr.getPredictedFileDataById(process.env.FILE_ID),
	// 	"\n-------------------------------------------------------\n"
	// );
	// console.log(
	// 	await ocr.predictUsingUrls(ocrUrlArray),
	// 	"\n-------------------------------------------------------\n"
	// );
	// console.log(
	// 	await ocr.predictUsingUrlsAsync(urlArray),
	// 	"\n-------------------------------------------------------\n"
	// );

	// Image Classification (IC) functions
	// Uncomment specific functions to get an output in the server console.
	/*
		Don't forget to
	 	- Add API Keys, Model IDs and other required data to a `.env` file in the root directory.
		- Uncomment the required Object invocations
	*/

	// console.log(
	// 	await ic.getModelDetails(),
	// 	"\n-------------------------------------------------------\n"
	// );
	// console.log(
	// 	await ic.predictUsingUrls(icUrlArray),
	// 	"\n-------------------------------------------------------\n"
	// );

	res.sendFile(__dirname + "/public/index.html");
});

app.get("/uploadFile", (req, res) => {
	res.sendFile(__dirname + "/public/fileUpload.html");
});

app.post("/uploadFile", upload.single("file"), async (req, res) => {
	console.log("Uploaded file details: ", req.file, "\n\nResponse:");

	if (req.body.operation === "ocr")
		console.log(
			await ocr.predictUsingFile(req.file.path),
			"\n-------------------------------------------------------\n"
		);
	else if (req.body.operation === "ocr-async")
		console.log(
			await ocr.predictUsingFileAsync(req.file.path),
			"\n-------------------------------------------------------\n"
		);
	else if (req.body.operation === "ic")
		console.log(
			await ic.predictUsingFile(req.file.path),
			"\n-------------------------------------------------------\n"
		);

	res.send("Uploaded. Check the server console for the response.");
});

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
	if (err) console.error("Node.js server error: ", err);
	else console.log(`Server started on port ${PORT}...`);
});
