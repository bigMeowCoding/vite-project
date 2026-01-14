export function parseResumeMarkdown(src) {
  const lines = src.split(/\r?\n/);
  const data = {
    header: {},
    education: [],
    skills: [],
    work: [],
    projects: [],
  };
  let i = 0;
  let section = "";
  let currentWork = null;
  let currentProject = null;
  let lastProjectResultIndex = -1;
  function trim(s) {
    return s.trim();
  }
  if (lines[i] && lines[i].startsWith("---")) {
    i++;
    while (i < lines.length && !lines[i].startsWith("---")) {
      const line = lines[i];
      const m = line.match(/^([a-zA-Z_]+)\s*:\s*(.*)$/);
      if (m) {
        data.header[m[1]] = trim(m[2]);
      }
      i++;
    }
    if (i < lines.length && lines[i].startsWith("---")) i++;
  }
  while (i < lines.length) {
    const line = lines[i];
    if (/^##\s*教育/.test(line)) {
      section = "education";
      currentWork = null;
      currentProject = null;
      i++;
      continue;
    }
    if (/^##\s*技能/.test(line)) {
      section = "skills";
      currentWork = null;
      currentProject = null;
      i++;
      continue;
    }
    if (/^##\s*工作/.test(line)) {
      section = "work";
      currentProject = null;
      i++;
      continue;
    }
    if (/^##\s*项目/.test(line)) {
      section = "projects";
      currentWork = null;
      i++;
      continue;
    }
    if (section === "education") {
      const m = line.match(/^-\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)\s*$/);
      if (m) {
        data.education.push({ school: trim(m[1]), detail: trim(m[2]), date: trim(m[3]) });
      }
    } else if (section === "skills") {
      const m = line.match(/^-\s*(.+)\s*$/);
      if (m) data.skills.push(trim(m[1]));
    } else if (section === "work") {
      if (/^###\s*/.test(line)) {
        const t = line.replace(/^###\s*/, "");
        const parts = t.split("|").map(trim);
        currentWork = { company: parts[0] || "", position: parts[1] || "", date: parts[2] || "", bullets: [] };
        data.work.push(currentWork);
      } else {
        const m = line.match(/^-\s*(.+)\s*$/);
        if (m && currentWork) currentWork.bullets.push(trim(m[1]));
      }
    } else if (section === "projects") {
      if (/^###\s*/.test(line)) {
        currentProject = { title: trim(line.replace(/^###\s*/, "")), intro: "", results: [] };
        data.projects.push(currentProject);
        lastProjectResultIndex = -1;
      } else if (/^简介：/.test(line) && currentProject) {
        currentProject.intro = trim(line.replace(/^简介：/, ""));
      } else if (/^(成果|核心成果)[:：]/.test(line)) {
        lastProjectResultIndex = -1;
      } else if (currentProject) {
        const numTop = line.match(/^\s*(\d+)\.\s*(.+)\s*$/);
        const bulletMatch = line.match(/^(\s*)-\s*(.+)\s*$/);
        
        if (numTop) {
          const index = parseInt(numTop[1], 10);
          const title = trim(numTop[2]);
          currentProject.results.push({ index, title, items: [] });
          lastProjectResultIndex = currentProject.results.length - 1;
        } else if (bulletMatch) {
          const indent = bulletMatch[1].length;
          const content = trim(bulletMatch[2]);
          
          if (indent >= 2 && lastProjectResultIndex >= 0) {
            // Sub-item
            const group = currentProject.results[lastProjectResultIndex];
            if (group) {
              if (typeof group === "string") {
                // Should not happen if we only use objects for structured, but for safety
                currentProject.results[lastProjectResultIndex] = {
                  title: group,
                  items: [content],
                };
              } else {
                group.items = group.items || [];
                group.items.push(content);
              }
            }
          } else {
            // Top-level bullet
            currentProject.results.push({ title: content, items: [] });
            lastProjectResultIndex = currentProject.results.length - 1;
          }
        }
      }
    }
    i++;
  }
  return data;
}

export function generateResumeMarkdown(store) {
  const h = store.header;
  const header = [
    "---",
    `name: ${h.name || ""}`,
    `gender: ${h.gender || ""}`,
    `birth: ${h.birth || ""}`,
    `city: ${h.city || ""}`,
    `experience: ${h.experience || ""}`,
    `position: ${h.position || ""}`,
    `phone: ${h.phone || ""}`,
    `email: ${h.email || ""}`,
    "---",
    "",
  ];
  const edu = ["## 教育", ...store.education.map(e => `- ${e.school} | ${e.detail} | ${e.date}`), ""];
  const skills = ["## 技能", ...store.skills.map(s => `- ${s}`), ""];
  const work = ["## 工作", ...store.work.flatMap(w => [`### ${w.company} | ${w.position} | ${w.date}`, ...w.bullets.map(b => `- ${b}`), ""]), ""];
  const projects = ["## 项目", ...store.projects.flatMap(p => [`### ${p.title}`, `简介：${p.intro || ""}`, "成果：", ...p.results.map(r => `- ${r}`), ""]), ""];
  return [...header, ...edu, ...skills, ...work, ...projects].join("\n");
}
