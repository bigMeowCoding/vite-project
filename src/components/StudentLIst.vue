<template>
  <div>
    <el-table :data="students" style="width: 100%">
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="age" label="Age" width="80"></el-table-column>
      <el-table-column prop="major" label="Major" width="180"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        ref="pagination"

        layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      v-model:current-page="currentPage"
      @current-change="handlePageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ElTable, ElTableColumn, ElPagination } from "element-plus";
import axios from "axios"; // 需要安装 axios 进行 HTTP 请求

export default {
  name: "StudentTable",
  setup() {
    const students = ref([]); // 学生列表数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(5); // 每页显示的数量
    const total = ref(0); // 学生总数，用于分页

    // 获取学生数据的函数
    const fetchStudents = async (page = 1, pageSize = 5) => {
      try {
        const response = await axios.get("http://localhost:3000/students", {
          params: {
            page, // 传递当前页码
            pageSize, // 传递每页显示数量
          },
        });

        // 更新学生数据和分页总数
        students.value = response.data.students;
        total.value = response.data.total;
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    // 页码变化时的处理函数
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchStudents(newPage, pageSize.value); // 根据新页码获取数据
    };

    // 初始化时获取第一页数据
    onMounted(() => {
      fetchStudents(currentPage.value, pageSize.value);
    });

    return {
      students,
      currentPage,
      pageSize,
      total,
      handlePageChange,
    };
  },
};
</script>

<style scoped>
.el-table {
  margin-bottom: 20px;
}
</style>
