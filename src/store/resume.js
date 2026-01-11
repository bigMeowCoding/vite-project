import { defineStore } from "pinia";
import { ref } from "vue";

export const useResumeStore = defineStore("resume", () => {
  const header = ref({
    name: "周义竣",
    gender: "男",
    birth: "1991/03",
    city: "上海",
    experience: "7年",
    position: "资深前端开发",
    phone: "15828042763",
    email: "zhou495248579@hotmail.com",
  });

  const education = ref([
    {
      school: "成都信息工程大学",
      detail: "计算机学院 – 计算机技术 – 硕士",
      date: "2015.09 – 2018.06",
    },
    {
      school: "南京信息工程大学",
      detail: "软件学院 – 软件工程 – 学士",
      date: "2009.09 – 2013.06",
    },
  ]);

  const skills = ref([
    "具备 4-7 人前端团队管理经验，擅长任务分解、代码评审、技术规划与人才培养，能带领团队高效交付复杂项目。",
    "熟练掌握 React、Vue 及其生态，深入理解其设计思想与核心原理，具备大型项目架构经验。",
    "了解 Webpack、Vite 构建原理，具备独立开发定制插件与自定义 CLI 工具的能力，以解决团队特定工程问题。",
    "熟练掌握 Babel AST 解析与操作，可开发 Babel 插件实现代码的自动化重构与质量提升。",
    "熟悉微前端核心原理（JS/CSS 隔离、应用通信），拥有从零落地架构方案并整合多应用的完整经验。",
    "作为核心开发者与架构师，拥有低代码平台从 0 到 1 的完整构建经验，涵盖技术选型、核心渲染引擎设计、性能优化与项目迭代全过程。",
    "了解前端性能优化全链路，涵盖资源加载、代码分割、渲染优化，并拥有通过 ARMS 实现全链路监控的实战经验。",
    "熟练运用 uni-app 进行多端应用开发，具备小程序模块化架构设计与落地能力。",
    "熟悉前端 CI/CD 流程，拥有基于云效等平台搭建自动化构建、部署流水线的经验。",
    "具备扎实的数据结构与算法基础，能熟练运用设计模式解决前端复杂业务场景问题。",
    "熟悉浏览器渲染原理、事件循环及计算机网络相关技术，能从底层原理分析性能瓶颈。",
    "了解 Node.js 开发，可进行全栈项目开发或编写中间层服务。",
  ]);

  const work = ref([
    {
      company: "霸王茶姬",
      position: "供应链前端团队负责人",
      date: "2024.1 – 2026.1",
      bullets: [
        "架构升级与模块化落地\n自研 B 端供应链系统微前端，攻克 JS/CSS 隔离、应用通信等核心难点，实现业务模块解耦与独立迭代，提升研发效率，线上问题影响范围缩减 50%；完成 uni 项目模块化拆分，解决体积庞大、协作低效的痛点，支撑小程序多模块独立开发与集成。",
        "工程化体系建设与提效\n自研 uni 多渠道分支合并，消除代码冗余，降低跨端维护成本 40%；搭建前端工程化 CI/CD 体系，落地基于 WebHook 的自动化构建部署流程，覆盖供应链所有前端项目，大幅减少人工操作成本，提升迭代效率。",
        "工具链研发与技术赋能\n构建自动化翻译工具，实现代码中文自动提取与 i18n 格式转换，国际化改造效率提升 80%，助力海外市场拓展；开发 babel 可选链自动化插件，一键将非兼容写法转为可选链安全写法，消除手动改造成本，提升代码健壮性。",
      ],
    },
    {
      company: "上海微盟企业发展有限公司",
      position: "资深前端开发",
      date: "2020.10 – 2023.11",
      bullets: [
        "作为核心开发者，完成乐高低代码平台 H5 端从 0 到 1 架构设计与 V2.0 重构升级，主包体积从 2.2MB 降至 330KB (-85%)，首屏渲染时间提升 50%。",
        "设计并开发团队统一工具库 bosMiniSdk.js，封装微信/支付宝小程序差异，提供统一 Promise 化 API，团队相关开发效率提升约 30%。",
        "负责团队集卡、砍价等五个核心营销项目的功能迭代与技术难题攻克。",
      ],
    },
  ]);

  const projects = ref([
    {
      title: "霸王功夫微前端架构设计与主应用开发",
      intro:
        "项目简介：针对多团队维护的\"霸王功夫后台\"存在的技术栈割裂（Vue/React）、单体应用稳定性风险高、团队协作低效、业务扩张受限等核心问题，设计\"轻量化自研+成熟模块复用\"架构的微前端方案。",
      results: [
        "主导微前端整体架构设计：打造兼容多框架、支持增量迁移、具备高隔离性的企业级微前端基座。",
        "隔离方案：JS 隔离基于 with+Proxy 实现全局变量沙箱，CSS 隔离通过 PostCSS 插件添加应用命名空间（如.appname .el-dialog），同时兼容 Element Plus 等组件库的 body 插入元素样式隔离。",
      ],
    },
    {
      title: "霸王功夫小程序渠道分支合并",
      intro:
        "项目简介：霸王功夫 uni 项目需同时支撑功夫 App、微信小程序及飞书应用三端业务，此前采用 master 分支（App + 微信小程序）与 master_feishu 分支（飞书应用）并行开发模式。该模式存在分支同步接手困难等问题，主导推进多分支合并优化，实现统一分支管理。",
      results: [
        "研发效率提升：消除双分支同步冗余操作，研发人效提升 30%+，自动化工具覆盖 80% 以上差异处理场景，大幅减少手动操作成本。",
        "产品质量保障：通过 hash 校验、提交校验、代理校验三重兜底机制，消除代码漏同步风险，分支冲突率下降 60%，线上故障发生率显著降低。",
        "运维成本优化：简化多端发布流程，测试回归效率提升 40%，统一依赖管理与开发规范，降低长期维护成本。",
      ],
    },
    {
      title: "Babel 工程化实践：可选链与智能 i18n 插件",
      intro:
        "项目简介：聚焦前端工程化提效与代码健壮性优化，基于 Babel 抽象语法树（AST）能力开发定制化插件，将项目中需手动调整的重复性、高风险代码改造工作自动化，彻底解决人工修改易遗漏、易出错的问题，同时保障代码兼容性与国际化落地效率。",
      results: [
        "可选链插件\n自动扫描 AST 中访问嵌套对象属性的代码，识别无兼容处理的节点，智能插入可选链（?.），并对空值兜底场景自动补充逻辑表达式。",
        "多语言翻译插件\n精准识别中文文本并一键替换为标准 i18n 调用格式，自动生成语义化 key，支持机翻与 Excel 协同。",
      ],
    },
    {
      title: "Uniapp 小程序模块化架构改造",
      intro:
        "项目简介：针对大型 UniApp 小程序并行开发时面临的单体架构瓶颈，主导设计并落地基于 Vite 的微前端解决方案。",
      results: [
        "独立开发与集成能力：实现子模块仓库独立启动、独立调试、独立打包，支持单模块验证业务逻辑。",
        "性能与效率优化：解决传统单体小程序痛点，编译速度提升 60%。",
      ],
    },
  ]);

  function setHeader(next) {
    header.value = { ...header.value, ...next };
  }

  function addEducation(item) {
    education.value.push(item);
  }
  function removeEducation(index) {
    education.value.splice(index, 1);
  }

  function setSkills(list) {
    skills.value = list;
  }

  function addWork(item) {
    work.value.push(item);
  }
  function removeWork(index) {
    work.value.splice(index, 1);
  }

  function addProject(item) {
    projects.value.push(item);
  }
  function removeProject(index) {
    projects.value.splice(index, 1);
  }

  return {
    header,
    education,
    skills,
    work,
    projects,
    setHeader,
    addEducation,
    removeEducation,
    setSkills,
    addWork,
    removeWork,
    addProject,
    removeProject,
  };
});
