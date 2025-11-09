import express from "express";
import db from "./db/client.js";
const app = express();
import { getAllFilesWithFolderName, createFile } from "./db/queries/files.js";
import {
  getAllFolders,
  getFolderById,
  getFolderByIdIncludingFiles,
} from "./db/queries/folders.js";

// Body parsing
app.use(express.json());

// To do router Express //
// Get Files //
app.get("/files", async (req, res, next) => {
  try {
    const files = await getAllFilesWithFolderName();
    res.json(files);
  } catch (error) {
    next(error);
  }
});

// GET Folders // List All //
app.get("/folders", async (req, res, next) => {
  try {
    const folders = await getAllFolders();
    res.json(folders);
  } catch (error) {
    next(error);
  }
});

// GET Folder ; id //

app.get("/folders/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send("Invalid folder id.");

    const folder = await getFolderByIdIncludingFiles(id);
    if (!folder) return res.status(404).send("Folder not found.");

    res.json(folder);
  } catch (error) {
    next(error);
  }
});

// POST /folders/:id/files //

app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send("Invalid folder id.");

    // Ensure folder exists
    const folder = await getFolderById(id);
    if (!folder) return res.status(404).send("Folder not found.");

    // Validate body
    if (!req.body) return res.status(400).send("Request body is required.");
    const { name, size } = req.body;
    if (!name || typeof name !== "string" || typeof size !== "number") {
      return res
        .status(400)
        .send("Missing or invalid fields: name (string), size (number).");
    }

    // Create file
    const file = await createFile({ name, size, folder_id: id });
    res.status(201).json(file);
  } catch (error) {
    // Handle unique violation on (name, folder_id)
    if (error?.code === "23505") {
      return res
        .status(400)
        .send("A file with that name already exists in this folder.");
    }
    next(error);
  }
});

// Error Middleware //
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// last //
export default app;
