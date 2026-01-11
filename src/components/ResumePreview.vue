<script setup>
import { storeToRefs } from "pinia";
import { useResumeStore } from "../store/resume.js";
import "../resume.css";
const store = useResumeStore();
const { header, education, skills, work, projects } = storeToRefs(store);

function formatText(text) {
  if (!text) return "";
  // Escape HTML characters
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  
  // Italic *text*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  
  // Code `text`
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  // Newlines
  html = html.replace(/\n/g, "<br>");
  
  return html;
}
</script>

<template>
  <div class="resume-container">
    <div class="header">
      <div class="name">{{ header.name }}</div>
      <div class="info-grid">
        <div class="info-item"><span class="info-label">性别：</span>{{ header.gender }}</div>
        <div class="info-item"><span class="info-label">出生年月：</span>{{ header.birth }}</div>
        <div class="info-item"><span class="info-label">所在城市：</span>{{ header.city }}</div>
        <div class="info-item"><span class="info-label">工作经验：</span>{{ header.experience }}</div>
        <div class="info-item"><span class="info-label">期望岗位：</span>{{ header.position }}</div>
        <div class="info-item"><span class="info-label">手机：</span>{{ header.phone }}</div>
        <div class="info-item" style="grid-column: span 2;">
          <span class="info-label">电子邮箱：</span>{{ header.email }}
        </div>
      </div>
    </div>

    <div class="section-title">教育经历</div>
    <div v-for="(e,i) in education" :key="i" class="edu-item">
      <div class="edu-left">
        <span class="school-name" v-html="formatText(e.school)"></span>
        <span class="edu-detail" v-html="formatText(e.detail)"></span>
      </div>
      <span class="edu-date" v-html="formatText(e.date)"></span>
    </div>

    <div class="section-title">专业技能</div>
    <ul class="skills-list">
      <li v-for="(s,i) in skills" :key="i" v-html="formatText(s)"></li>
    </ul>

    <div class="section-title">工作经历</div>
    <div v-for="(w,i) in work" :key="i" class="work-item">
      <div class="work-header">
        <span class="company-name" v-html="formatText(w.company)"></span>
        <span class="position" v-html="formatText(w.position)"></span>
        <span class="work-date" v-html="formatText(w.date)"></span>
      </div>
      <div class="work-content">
        <ol>
          <li v-for="(b,j) in w.bullets" :key="j" v-html="formatText(b)"></li>
        </ol>
      </div>
    </div>

    <div class="section-title">项目经历</div>
    <div v-for="(p,i) in projects" :key="i" class="project-item">
      <div class="project-title" v-html="formatText(p.title)"></div>
      <p class="project-intro"><strong style="color:#333">项目简介：</strong><span v-html="formatText(p.intro)"></span></p>
      <div class="project-results">
        <div class="project-results-title">核心成果：</div>
        <ul>
          <li v-for="(r,j) in p.results" :key="j" v-html="formatText(r)"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
