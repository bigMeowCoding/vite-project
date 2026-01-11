import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import puppeteer from "puppeteer";

const root = path.resolve(process.cwd());
const outPath = path.join(root, "dist", "resume.pdf");

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", ...opts });
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exit ${code}`));
    });
    p.on("error", reject);
  });
}

async function main() {
  await run("npm", ["run", "build"], { shell: true });
  const preview = spawn("npm", ["run", "preview", "--", "--port", "4173"], {
    shell: true,
    stdio: "inherit",
  });
  await new Promise((r) => setTimeout(r, 1500));
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
  fs.mkdirSync(path.join(root, "dist"), { recursive: true });
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
  });
  await browser.close();
  preview.kill("SIGINT");
  console.log(`导出完成：${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
