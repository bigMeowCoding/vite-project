<script setup>
import { reactive } from "vue";
import { useResumeStore } from "../store/resume.js";
import ResumePreview from "../components/ResumePreview.vue";
const store = useResumeStore();
const localHeader = reactive({ ...store.header });
function applyHeader() {
  store.setHeader(localHeader);
}
function addEducation() {
  store.addEducation({ school: "", detail: "", date: "" });
}
function removeEducation(i) {
  store.removeEducation(i);
}
function applySkills(val) {
  const list = val.split("\n").map(s => s.trim()).filter(Boolean);
  store.setSkills(list);
}
function addWork() {
  store.addWork({ company: "", position: "", date: "", bullets: [] });
}
function removeWork(i) {
  store.removeWork(i);
}
function addBullet(i) {
  store.work[i].bullets.push("");
}
function removeBullet(i, j) {
  store.work[i].bullets.splice(j, 1);
}
function addProject() {
  store.addProject({ title: "", intro: "", results: [] });
}
function removeProject(i) {
  store.removeProject(i);
}
function addResult(i) {
  store.projects[i].results.push("");
}
function removeResult(i, j) {
  store.projects[i].results.splice(j, 1);
}
function exportPdfBrowser() {
  window.print();
}
</script>

<template>
  <el-row :gutter="12" class="main-layout">
    <el-col :span="10" class="editor-side no-print">
      <el-card>
        <template #header>基础信息</template>
        <el-form label-width="90px">
          <el-form-item label="姓名"><el-input v-model="localHeader.name" /></el-form-item>
          <el-form-item label="性别"><el-input v-model="localHeader.gender" /></el-form-item>
          <el-form-item label="出生年月"><el-input v-model="localHeader.birth" /></el-form-item>
          <el-form-item label="所在城市"><el-input v-model="localHeader.city" /></el-form-item>
          <el-form-item label="工作经验"><el-input v-model="localHeader.experience" /></el-form-item>
          <el-form-item label="期望岗位"><el-input v-model="localHeader.position" /></el-form-item>
          <el-form-item label="手机"><el-input v-model="localHeader.phone" /></el-form-item>
          <el-form-item label="电子邮箱"><el-input v-model="localHeader.email" /></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="applyHeader">应用到预览</el-button>
            <el-button @click="exportPdfBrowser">导出 PDF（浏览器）</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card style="margin-top:12px">
        <template #header>教育经历</template>
        <el-button size="small" @click="addEducation">新增经历</el-button>
        <div style="margin-top:10px">
          <div v-for="(e,i) in store.education" :key="i" style="margin-bottom:8px">
            <el-form label-width="90px">
              <el-form-item label="学校"><el-input v-model="e.school" /></el-form-item>
              <el-form-item label="详情"><el-input v-model="e.detail" /></el-form-item>
              <el-form-item label="日期"><el-input v-model="e.date" /></el-form-item>
              <el-button size="small" type="danger" @click="removeEducation(i)">删除</el-button>
            </el-form>
          </div>
        </div>
      </el-card>

      <el-card style="margin-top:12px">
        <template #header>专业技能</template>
        <el-input
          type="textarea"
          :rows="8"
          :placeholder="'每行一个技能条目'"
          :model-value="store.skills.join('\n')"
          @input="applySkills"
        />
      </el-card>

      <el-card style="margin-top:12px">
        <template #header>工作经历</template>
        <el-button size="small" @click="addWork">新增工作</el-button>
        <div style="margin-top:10px">
          <div v-for="(w,i) in store.work" :key="i" style="margin-bottom:8px">
            <el-form label-width="90px">
              <el-form-item label="公司"><el-input v-model="w.company" /></el-form-item>
              <el-form-item label="岗位"><el-input v-model="w.position" /></el-form-item>
              <el-form-item label="日期"><el-input v-model="w.date" /></el-form-item>
              <el-form-item label="要点">
                <div>
                  <el-button size="small" @click="addBullet(i)">新增要点</el-button>
                  <div style="margin-top:6px">
                    <div v-for="(b,j) in w.bullets" :key="j" style="display:flex;gap:6px;margin-bottom:6px">
                      <el-input v-model="w.bullets[j]" type="textarea" :rows="2" />
                      <el-button size="small" type="danger" @click="removeBullet(i,j)">删除</el-button>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-button size="small" type="danger" @click="removeWork(i)">删除工作</el-button>
            </el-form>
          </div>
        </div>
      </el-card>

      <el-card style="margin-top:12px">
        <template #header>项目经历</template>
        <el-button size="small" @click="addProject">新增项目</el-button>
        <div style="margin-top:10px">
          <div v-for="(p,i) in store.projects" :key="i" style="margin-bottom:8px">
            <el-form label-width="90px">
              <el-form-item label="标题"><el-input v-model="p.title" /></el-form-item>
              <el-form-item label="简介"><el-input v-model="p.intro" type="textarea" :rows="3" /></el-form-item>
              <el-form-item label="成果">
                <div>
                  <el-button size="small" @click="addResult(i)">新增成果</el-button>
                  <div style="margin-top:6px">
                    <div v-for="(r,j) in p.results" :key="j" style="display:flex;gap:6px;margin-bottom:6px">
                      <el-input v-model="p.results[j]" type="textarea" :rows="2" />
                      <el-button size="small" type="danger" @click="removeResult(i,j)">删除</el-button>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-button size="small" type="danger" @click="removeProject(i)">删除项目</el-button>
            </el-form>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14" class="preview-side">
      <ResumePreview />
    </el-col>
  </el-row>
</template>

<style>
@media print {
  .no-print, .editor-side {
    display: none !important;
  }
  .preview-side {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .main-layout {
    display: block !important;
    margin: 0 !important;
  }
  body, html, #app {
    height: auto !important;
    overflow: visible !important;
  }
}
</style>
