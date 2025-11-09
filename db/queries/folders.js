import db from "#db/client";

// create folder data //
export async function createFolder({ name }) {
  const sql = `
INSERT INTO folders (name)
VALUES ($1)
RETURNING *;
`;
  const {
    rows: [folder],
  } = await db.query(sql, [name]);
  return folder;
}

// Get all folders //
export async function getAllFolders() {
  const { rows: folders } = await db.query(`
    SELECT * FROM folders ORDER BY id;
  `);
  return folders;
}

/** Get one folder (or null) */
export async function getFolderById(id) {
  const {
    rows: [folder],
  } = await db.query(
    `
    SELECT * FROM folders WHERE id = $1;
  `,
    [id]
  );
  return folder ?? null;
}

/** Get folder by id including its files as an array in "files" */
export async function getFolderByIdIncludingFiles(id) {
  const sql = `
    SELECT
      folders.id,
      folders.name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', files.id,
            'name', files.name,
            'size', files.size,
            'folder_id', files.folder_id
          )
        ) FILTER (WHERE files.id IS NOT NULL),
        '[]'::json
      ) AS files
    FROM folders
    LEFT JOIN files ON files.folder_id = folders.id
    WHERE folders.id = $1
    GROUP BY folders.id, folders.name;
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder ?? null;
}

/** Delete folder (cascades files) */
export async function deleteFolderById(id) {
  const {
    rows: [deleted],
  } = await db.query(
    `
    DELETE FROM folders WHERE id = $1 RETURNING *;
  `,
    [id]
  );
  return deleted ?? null;
}
