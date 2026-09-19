import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = await readdir("dist/assets");
const hash = createHash("sha256");
for (const f of files) hash.update(await readFile("dist/assets/" + f));
let sw = await readFile("dist/sw.js", "utf8");
hash.update(sw);
sw = sw.replace("synaptik-v1", "synaptik-" + hash.digest("hex").slice(0, 12));
sw = sw.replace(
  /(["'])\.\/index\.html\1,/,
  (match) =>
    match + files.map((f) => JSON.stringify("./assets/" + f)).join(",") + ",",
);
if (!sw.includes("./assets/"))
  throw new Error("Build must precache compiled assets");
await writeFile("dist/sw.js", sw);
