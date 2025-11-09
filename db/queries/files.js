import db from "#db/client";

// create files  //
export async function createFile({ name, size, folder_id }) {
  const sql = `
  INSERT INTO files (name, size, folder_id)
  VALUES ($1, $2, $3)
  RETURNING *;     
    `;
  const {
    rows: [file],
  } = await db.query(sql, [name, size, folder_id]);
  return file;
}

/** Get all files (no folder name) */
export async function getAllFiles() {
  const { rows: files } = await db.query(`
    SELECT * FROM files ORDER BY id;
  `);
  return files;
}

/** Get all files including folder_name via JOIN */
export async function getAllFilesWithFolderName() {
  const sql = `
    SELECT
      files.*,
      folders.name AS folder_name
    FROM files
    JOIN folders ON folders.id = files.folder_id
    ORDER BY files.id;
  `;
  const { rows } = await db.query(sql);
  return rows;
}

/** Get files for a folder */
export async function getFilesByFolderId(folder_id) {
  const { rows: files } = await db.query(
    `
    SELECT * FROM files
    WHERE folder_id = $1
    ORDER BY id;
  `,
    [folder_id]
  );
  return files;
}

/** Get one file */
export async function getFileById(id) {
  const {
    rows: [file],
  } = await db.query(
    `
    SELECT * FROM files WHERE id = $1;
  `,
    [id]
  );
  return file ?? null;
}

/** Delete a file */
export async function deleteFileById(id) {
  const {
    rows: [deleted],
  } = await db.query(
    `
    DELETE FROM files WHERE id = $1 RETURNING *;
  `,
    [id]
  );
  return deleted ?? null;
}
