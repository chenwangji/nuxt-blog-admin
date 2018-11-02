<template>
  <div class="tags">
    <div class="btn">
      <el-button
        size="small"
        @click="addTag">
        增加标签
      </el-button>
      <div class="search">
        <el-input
          v-model="keyword"
          placeholder="name..."
          @keyup.enter.native="getData"
          prefix-icon="el-icon-search"
          size="small"></el-input>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tagData"
        style="width: 100%"
        v-loading="fetch"
        border>
        <el-table-column
          label="名称"
          width="160"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="iconfont icon-tag mar"></i>
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          min-width="320"
          label-class-name="head">
          <template slot-scope="scope">
            <i class="iconfont icon-descript mar"></i>
            {{ scope.row.descript }}
          </template>
        </el-table-column>
        <el-table-column
          label="文章"
          prop="count"
          width="80"
          label-class-name="head">
        </el-table-column>
        <el-table-column
          label="操作"
          width="240"
          label-class-name="head">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="small"
              @click="editTag(scope.row)">
              修改
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteTag(scope.row)">
              {{ scope.row.deleting ? '删除中' : '删 除' }}
            </el-button>
            <el-button
              type="text"
              size="small"
              class="drag">
              <i class="iconfont icon-list"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { error } from '@/utils/response'

@Component
export default class Tags extends Vue {
  private keyword = ''

  private get tagData () { return [] }

  private get fetch () { return false }

  private async getData (): Promise<void> {}

  private async addTag (): Promise<void> {}

  private editTag () {}

  private deleteTag () {}
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variable.scss';
.tags {
  > .btn {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem 0;
    background: $white;
  }

  .drag {
    cursor: move;

    i {
      font-size: 0.8rem;
    }
  }
}
</style>
