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

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          layout="prev, pager, next"
          :page-size="pageSize"
          @current-change="pageChange"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogV"
      size="tiny"
      width="460px">
      <el-form
        ref="form"
        :model="form"
        v-if="dialogV">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[
            { required: true, message: '名称', trigger: 'blur' }
          ]">
          <el-input
            v-model="form.name"
            :maxlength="20"
            placeholder="name"></el-input>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="descript">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.descript"
            :maxlength="100"
            placeholder="descript"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogV = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="posting"
          @click="submit('form')">
          {{ posting ? '提交中' : '确定' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as Sortable from 'sortablejs'

import { error } from '@/utils/response'

@Component
export default class Tags extends Vue {
  private keyword: string = ''
  private currentPage: number = 1
  private dialogV: boolean = false
  private title: string = ''
  private pageSize: number = 16
  private form: StoreState.Tag = {
    name: '',
    descript: ''
  }

  private get tagData (): StoreState.Tag[] {
    return this.$store.state.tag.list
  }

  private get fetch (): boolean {
    return this.$store.state.tag.fetch
  }

  private get posting (): boolean {
    return this.$store.state.tag.posting
  }

  private get total (): number {
    return this.$store.state.tag.total
  }

  private get list (): string[] {
    return this.tagData.map((item: StoreState.Tag) => item._id) as string[]
  }

  private async getData (): Promise<void> {
    const res: Ajax.AjaxResponse = await this.$store.dispatch('tag/getTags', {
      current_page: this.currentPage,
      page_size: this.pageSize,
      keyword: this.keyword
    })
    if (res.code === 1) {
      this.$nextTick(this.setSort)
    }
  }

  private addTag (): void {
    this.title = '添加标签'
    this.form = {
      name: '',
      descript: ''
    }
    this.dialogV = true
  }

  private editTag (row: StoreState.Tag) {
    this.title = '修改标签'
    this.form = { ...row }
    this.dialogV = true
  }

  private submit (formName: string) {
    (this.$refs[formName] as HTMLFormElement).validate(async (valid: boolean): Promise<boolean> => {
      if (valid) {
        let actionName: string
        let params: StoreState.Tag

        actionName = this.form._id ? 'tag/putTag' : 'tag/postTag'
        params = { ...this.form }
        const res: Ajax.AjaxResponse = await this.$store.dispatch(actionName, params)
        if (res.code === 1) {
          this.dialogV = false
          this.getData()
        }
        return true
      }
      return false
    })
  }

  private deleteTag (row: StoreState.Tag): void {
    this.$confirm('确定删除此数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async (): Promise<void> => {
      const { code } = await this.$store.dispatch('tag/deleteTag', { _id: row._id })
      if (code === 1) this.getData()
    }).catch(e => console.error(e))
  }

  private pageChange (val: number): void {
    this.currentPage = val
    this.getData()
  }

  // 标签排序
  private setSort (): void {
    const el: Element = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    Sortable.create(el, {
      animation: 150,
      onEnd: (evt: any) => {
        const tempIndex = this.list.splice(evt.oldIndex, 1)[0]
        this.list.splice(evt.newIndex, 0, tempIndex)
        this.$store.dispatch('tag/patchTag', {
          ids: this.list
        })
      }
    })
  }

  private created (): void {
    this.getData()
  }
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
