<script setup>
import ResumePreview from "../components/ResumePreview.vue";
import { useResumeStore } from "../store/resume.js";
import { parseResumeMarkdown } from "../utils/resumeMarkdown.js";
import md from "../resume.md?raw";

const store = useResumeStore();

function applyFromMarkdown(src) {
  const data = parseResumeMarkdown(src || "");
  if (data.header) store.setHeader(data.header);
  if (Array.isArray(data.education)) store.setEducation(data.education);
  if (Array.isArray(data.skills)) store.setSkills(data.skills);
  if (Array.isArray(data.work)) store.setWork(data.work);
  if (Array.isArray(data.projects)) store.setProjects(data.projects);
}

applyFromMarkdown(md);

if (import.meta.hot) {
  import.meta.hot.accept(["../resume.md?raw"], (mods) => {
    const m = mods && mods[0];
    const next = m && (m.default ?? m);
    applyFromMarkdown(next || md);
  });
}
</script>

<template>
  <ResumePreview />
</template>

<style scoped></style>
