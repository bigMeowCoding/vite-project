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

function isOrdered(results) {
  if (!results || results.length === 0) return false;
  const first = results[0];
  // 如果是字符串，认为是无序
  if (typeof first === 'string') return false;
  // 如果有 index 属性，认为是有序
  return first.index !== undefined;
}

// 页面高度计算
// A4纸高度 297mm
// 浏览器打印时，通常会有页边距。如果在 CSS 中设置了 @page { margin: 8mm; }
// 则内容高度每页约为 297 - 16 = 281mm。
// 这里的 281mm 指的是内容流的高度。
// 我们在预览容器中每隔 281mm 画一条线即可。
// 1mm ≈ 3.7795px
const PAGE_HEIGHT_MM = 281;
const PAGE_HEIGHT_PX = PAGE_HEIGHT_MM * 3.7795;

import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

const containerRef = ref(null);
const totalPages = ref(0);

const updatePageGuides = () => {
  if (!containerRef.value) return;
  // 获取容器高度
  const height = containerRef.value.scrollHeight;
  // 计算页数
  totalPages.value = Math.floor(height / PAGE_HEIGHT_PX);
};

// 监听数据变化，更新参考线
watch([header, education, skills, work, projects], () => {
  nextTick(updatePageGuides);
}, { deep: true });

onMounted(() => {
  updatePageGuides();
  window.addEventListener('resize', updatePageGuides);
});

onUnmounted(() => {
  window.removeEventListener('resize', updatePageGuides);
});
</script>

<template>
  <div class="resume-container" ref="containerRef">
    <!-- 页面辅助线 -->
    <div 
      v-for="n in totalPages" 
      :key="n" 
      class="page-guide" 
      :style="{ top: (n * PAGE_HEIGHT_PX) + 'px' }"
      :data-page="'第 ' + n + ' 页结束 / 第 ' + (n + 1) + ' 页开始'"
    ></div>

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
      <p class="project-intro">
        <strong style="color:#333">项目简介：</strong>
        <span v-html="formatText(p.intro)"></span>
      </p>
      <div class="project-results">
        <div class="project-results-title">核心成果：</div>
        <!-- 外层：项目成果根据内容动态切换有序/无序列表 -->
        <component 
          :is="isOrdered(p.results) ? 'ol' : 'ul'" 
          :class="['project-results-list', isOrdered(p.results) ? '' : 'unordered']"
        >
          <li v-for="(r,j) in p.results" :key="j">
            <template v-if="typeof r === 'string'">
              <span class="project-result-main" v-html="formatText(r)"></span>
            </template>
            <template v-else>
              <!-- 一级标题：数字序号由 ol 控制，这里只展示标题文本，可以包含 markdown 加粗 -->
              <span class="project-result-main" v-html="formatText(r.title || '')"></span>
              <!-- 二级：支持嵌套无序列表 -->
              <ul v-if="r.items && r.items.length" class="project-result-sub-list">
                <li v-for="(sub,k) in r.items" :key="k" v-html="formatText(sub)"></li>
              </ul>
            </template>
          </li>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
