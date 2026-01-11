import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import puppeteer from "puppeteer";

const root = path.resolve(process.cwd());
const outPath = path.join(root, "dist", "resume.pdf");

async function main() {
  console.log('Building project...');
  // Build the project to dist folder
  await new Promise((resolve, reject) => {
    const p = spawn("npm", ["run", "build"], { stdio: "inherit", shell: true });
    p.on("close", (code) => code === 0 ? resolve() : reject(new Error(`Build failed with code ${code}`)));
  });

  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files' // Allow file:// access
    ],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  const page = await browser.newPage();
  
  try {
    const fileUrl = `file://${path.join(root, 'dist', 'index.html')}`;
    console.log(`Loading ${fileUrl}...`);
    
    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 1000)); // Ensure rendering is stable
    
    fs.mkdirSync(path.join(root, "dist"), { recursive: true });
    await page.pdf({
      path: outPath,
      format: "A4",
      printBackground: true,
      margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
    });
    console.log(`导出完成：${outPath}`);
  } catch (e) {
    console.error('PDF generation failed:', e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
