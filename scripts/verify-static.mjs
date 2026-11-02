import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requiredFiles = [
  "dist/index.html",
  "dist/styles.css",
  "dist/app.js",
  "dist/admin.js",
  "dist/sheets.js",
  "dist/vendor/pako_inflate.min.js"
];

async function ensureFile(relativePath) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    throw new Error(`Missing required deployment file: ${relativePath}`);
  }
}

for (const file of requiredFiles) await ensureFile(file);

const indexHtml = await readFile(path.join(root, "dist/index.html"), "utf8");
const assetPattern = /(?:src|href)=["']([^"']+)["']/g;
const missingAssets = [];

for (const match of indexHtml.matchAll(assetPattern)) {
  const asset = match[1];
  if (/^(?:https?:|data:|#)/i.test(asset)) continue;
  try {
    await ensureFile(path.posix.join("dist", asset));
  } catch {
    missingAssets.push(asset);
  }
}

if (missingAssets.length) {
  throw new Error(`index.html references missing local assets: ${missingAssets.join(", ")}`);
}

console.log("Static deployment check passed: all entry files and referenced local assets exist.");

