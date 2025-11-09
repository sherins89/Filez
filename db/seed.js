import db from "#db/client";
import { createFolder } from "./queries/folders.js";
import { createFile } from "./queries/files.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Clear data //
  await db.query("DELETE FROM files;");
  await db.query("DELETE FROM folders;");

  // === 3 folders ===
  const projectDocuments = await createFolder({ name: "Project Documents" });
  const images = await createFolder({ name: "Images" });
  const sourceCode = await createFolder({ name: "Source Code" });

  // Project Documents (≥5)
  await createFile({
    name: "requirements.md",
    size: 120,
    folder_id: projectDocuments.id,
  });
  await createFile({
    name: "architecture.pdf",
    size: 2048,
    folder_id: projectDocuments.id,
  });
  await createFile({
    name: "meeting-notes.docx",
    size: 256,
    folder_id: projectDocuments.id,
  });
  await createFile({
    name: "timeline.xlsx",
    size: 98,
    folder_id: projectDocuments.id,
  });
  await createFile({
    name: "proposal-final.pdf",
    size: 3100,
    folder_id: projectDocuments.id,
  });

  // Images (≥5)
  await createFile({ name: "logo.png", size: 500, folder_id: images.id });
  await createFile({ name: "banner.jpg", size: 1200, folder_id: images.id });
  await createFile({
    name: "background.webp",
    size: 2560,
    folder_id: images.id,
  });
  await createFile({ name: "profile.jpg", size: 985, folder_id: images.id });
  await createFile({ name: "thumbnail.png", size: 210, folder_id: images.id });

  // Source Code (≥5)
  await createFile({ name: "index.js", size: 15, folder_id: sourceCode.id });
  await createFile({ name: "app.js", size: 32, folder_id: sourceCode.id });
  await createFile({ name: "database.js", size: 40, folder_id: sourceCode.id });
  await createFile({ name: "routes.js", size: 20, folder_id: sourceCode.id });
  await createFile({ name: "server.js", size: 26, folder_id: sourceCode.id });
}
