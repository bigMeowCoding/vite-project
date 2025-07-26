import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(
  {
    plugins:
      [
        react(),
      ],
    test: {
      // 模拟浏览器环境
      environment:
        "jsdom",
      // 测试文件匹配规则
      include:
        [
          "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        ],
      // 开启覆盖率报告
      coverage:
        {
          reporter:
            [
              "text",
              "html",
            ],
        },
    },
  }
)
