import path from "node:path";
import fs from "node:fs";
import puppeteer from "puppeteer";
import { createServer } from "vite";

const root = path.resolve(process.cwd());
const outPath = path.join(root, "dist", "resume.pdf");

async function main() {
  console.log('Starting internal dev server...');
  
  // 使用 Vite API 直接启动开发服务，无需构建
  const server = await createServer({
    configFile: path.resolve(root, 'vite.config.js'),
    root: root,
    server: {
      port: 0, // 自动分配可用端口
    }
  });
  
  await server.listen();
  const address = server.httpServer.address();
  const port = address.port;
  const url = `http://localhost:${port}/`;
  
  console.log(`Server running at ${url}`);

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
    await server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
