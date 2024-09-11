<template>
  <div class="upload-container">
    <h2>上传你的图标</h2>
    <input type="file" @change="handleFileUpload" />
  </div>
</template>

<script>
export default {
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("icon", file);

      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "iconfont.ttf"; // 下载字体文件
          a.click();
        } else {
          console.error("上传失败");
        }
      } catch (error) {
        console.error("上传过程中发生错误:", error);
      }
    },
  },
};
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>
