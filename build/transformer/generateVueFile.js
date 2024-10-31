function generateVueFile(descriptor) {
  let content = "";

  // 处理 template 部分
  if (descriptor.template) {
    const templateAttrs = Object.entries(descriptor.template.attrs || {})
      .map(([key, value]) => `${key}${value === true ? "" : `="${value}"`}`)
      .join(" ");
    content += `<template${templateAttrs ? " " + templateAttrs : ""}>\n${descriptor.template.content}\n</template>\n\n`;
  }

  // 处理 script 部分
  if (descriptor.script) {
    const scriptAttrs = Object.entries(descriptor.script.attrs || {})
      .map(([key, value]) => {
        if (key === "setup" && value === true) {
          return "setup";
        }
        return `${key}${value === true ? "" : `="${value}"`}`;
      })
      .join(" ");
    content += `<script${scriptAttrs ? " " + scriptAttrs : ""}>\n${descriptor.script.content}\n</script>\n\n`;
  }

  // 处理 script setup 部分（如果存在）
  if (descriptor.scriptSetup) {
    const scriptSetupAttrs = Object.entries(descriptor.scriptSetup.attrs || {})
      .map(([key, value]) => {
        if (key === "setup" && value === true) {
          return "";
        }
        return `${key}${value === true ? "" : `="${value}"`}`;
      })
      .filter(Boolean)
      .join(" ");
    content += `<script setup${scriptSetupAttrs ? " " + scriptSetupAttrs : ""}>\n${descriptor.scriptSetup.content}\n</script>\n\n`;
  }

  // 处理 style 部分
  if (descriptor.styles.length > 0) {
    descriptor.styles.forEach((style) => {
      const styleAttrs = Object.entries(style.attrs || {})
        .map(([key, value]) => `${key}${value === true ? "" : `="${value}"`}`)
        .join(" ");
      content += `<style${styleAttrs ? " " + styleAttrs : ""}>\n${style.content}\n</style>\n\n`;
    });
  }

  return content.trim();
}

module.exports = { generateVueFile };
