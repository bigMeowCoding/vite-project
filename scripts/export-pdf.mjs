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

  console.log('Starting preview server...');
  const server = spawn("npm", ["run", "preview", "--", "--port", "14173", "--strictPort"], { 
    stdio: 'inherit',
    shell: true 
  });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
    ],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  
  try {
    const page = await browser.newPage();
    const url = 'http://localhost:14173/';
    console.log(`Loading ${url}...`);
    
    await page.goto(url, { waitUntil: "networkidle0" });
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
    server.kill();
    // Force kill if needed, though usually unnecessary if process exits
    try { process.kill(server.pid); } catch (e) { /* ignore */ }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
