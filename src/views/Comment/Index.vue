<template>
  <div class="comments">
    <card
      :type="type"
      :width="width"
      @toggle="changeType($event)">
      <div
        class="item"
        style="margin-top: 10px">
        <span
          :style="{ width: width }"
          class="text"
          style="line-height: 38px">
          搜索：
        </span>
        <div class="el-radio-group">
          <el-input
            v-model="keyword"
            placeholder="name, content, email..."
            @keyup.enter.native="getData"
            size="small"></el-input>
            <el-button
              type="primary"
              size="small"
              @click.native="getData">
              查询
            </el-button>
        </div>
      </div>
    </card>
    <div class="table">
      <el-table
        :data="list"
        style="width: 100%"
        v-loading="fetch">
        <el-table-column
          type="expand"
          label-class-name="head">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="table-expand">
              <el-form-item label="IP：">
                <span>{{ props.row.ip }}</span>
              </el-form-item>
              <el-form-item label="地址：">
                <span>{{ props.row.country }}/{{ props.row.city }}</span>
              </el-form-item>
              <el-form-item label="浏览器：">
                <span v-html="uaParse(props.row.agent)"></span>
              </el-form-item>
              <el-form-item label="系统：">
                <span v-html="osParse(props.row.agent)"></span>
              </el-form-item>
              <el-form-item label="内容：">
                <span>{{ props.row.content }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="文章id"
          prop="post_id"
          label-class-name="head"
          width="80">
        </el-table-column>
        <el-table-column
          label="姓名"
          label-class-name="head"
          min-width="120">
          <template slot-scope="scope">
            {{ scope.row.author && scope.row.author.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="邮箱"
          label-class-name="head"
          show-overflow-tooltip
          min-width="120">
          <template slot-scope="scope">
            {{ scope.row.author && scope.row.author.email }}
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          label-class-name="head"
          width="200">
          <template slot-scope="scope">
            {{ scope.row.create_at | format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          label-class-name="head"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.state === 0 ? '待审核' : scope.row.state === 1 ? '通过' : '不通过' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="240">
          <template slot-scope="scope">
            <transition-group
              tag="span"
              name="btn">
              <el-button
                type="info"
                size="small"
                key="-1"
                @click="editComment(scope.row)">
                修改
              </el-button>
              <el-button
                v-if="scope.row.state === 0 || scope.row.state === 1"
                type="success"
                size="small"
                key="1"
                @click="changeState(scope.row, 2)">
                通过
              </el-button>
              <el-button
                v-if="scope.row.state === 0 || scope.row.state === 2"
                type="danger"
                size="small"
                key="2"
                @click="changeState(scope.row, 1)">
                不通过
              </el-button>
              <el-button
                :disabled="scope.row.deleting"
                type="danger"
                size="small"
                key="3"
                @click="deleteComment(scope.row)">
                {{ scope.row.deleting ? '删除中' : '删除' }}
              </el-button>
            </transition-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="20"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="pageChange">

        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="修改评论"
      :visible.sync="dialogV"
      size="tiny"
      width="460px">
      <el-form
        v-if="dialogV"
        :model="form"
        ref="form">
        <el-form-item
          label="名字">
          <el-input
            v-model="form.name"
            :maxlength="20"
            placeholder="name"></el-input>
        </el-form-item>
        <el-form-item
          class="content"
          label="内容">
          <el-input
            type="textarea"
            v-model="form.content"
            :maxlength="100"
            :rows="3"
            placeholder="content"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogV = false">取 消</el-button>
        <el-button
          :disabled="posting"
          type="primary"
          @click="submit('form')">
          {{ posting ? '提交中' : '确 定' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Card from '@/components/Card.vue'
import { uaParse, osParse } from '@/utils/ua-parse'

interface IItem {
  name: string
  id: StoreState.State
}

interface IType {
  name: string
  typeName: string
  list: IItem[]
  default: string
}

@Component({ components: { Card } })
export default class Comment extends Vue {
  private type: IType[] = [
    {
      name: '状态',
      typeName: 'state',
      list: [
        { name: '全部', id: '' },
        { name: '审核通过', id: 1 },
        { name: '审核不通过', id: 2 }
      ],
      default: ''
    }
  ]
  private width = '48px'
  private keyword = ''
  private currentPage = 1
  private state: StoreState.State = ''
  private dialogV = false
  private form: StoreState.Comment = {
    author: {
      name: ''
    },
    name: '',
    content: ''
  }

  private get fetch (): boolean {
    return this.$store.state.comment.fetch
  }

  private get list (): StoreState.Comment[] {
    return this.$store.state.comment.list
  }

  private get total (): number {
    return this.$store.state.comment.total
  }

  private get posting (): boolean {
    return this.$store.state.comment.posting
  }

  // 类型筛选
  private changeType (e: any): void {
    this.state = e.id
    this.getData()
  }

  private getData (): void {
    this.$store.dispatch('comment/getComments', {
      current_page: this.currentPage,
      page_size: 16,
      keyword: this.keyword,
      state: this.state
    })
  }

  // 修改
  private editComment (row: StoreState.Comment) {
    this.dialogV = true
    this.form = {
      ...row,
      name: row.author && row.author.name
    }
  }

  // 修改状态
  private async changeState (row: StoreState.Comment, state: number): Promise<void> {
    await this.$store.dispatch('comment/putComment', {
      ...row,
      state,
      post_ids: row.post_id
    })
  }

  // 删除
  private deleteComment (row: StoreState.Comment): void {
    this.$confirm('确定删除此数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const res: Ajax.AjaxResponse = await this.$store.dispatch('comment/deleteComment', {
        _id: row._id,
        post_id: row.post_id
      })
      if (res.code === 1) this.getData()
    }).catch(err => console.log(err))
  }

  private uaParse (str: string): string {
    return uaParse(str)
  }

  private osParse (str: string): string {
    return osParse(str)
  }

  private submit (formName: string) {
    (this.$refs[formName] as HTMLFormElement).validate(async (valid: boolean): Promise<boolean> => {
      if (valid) {
        (this.form as any).author.name = this.form.name
        delete this.form.name
        const res: Ajax.AjaxResponse = await this.$store.dispatch('comment/putComment', {
          ...this.form,
          post_ids: this.form.post_id,
          author: this.form.author
        })

        if (res.code === 1) {
          this.dialogV = false
          this.getData()
        }
        return true
      }
      return false
    })
  }

  private pageChange (val: number) {
    this.currentPage = val
    this.getData()
  }

  private beforeCreate (): void {
    this.$store.dispatch('comment/getComments', {
      current_page: 1,
      page_size: 16
    })
  }
}
</script>
<style lang="scss">

@import '../../assets/scss/variable.scss';

.comments {

  >.el-card {
    margin-bottom: $normal-pad;
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 70px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 40%;
  }

  .table-expand .el-form-item:last-child {
    width: 100%;
  }
}
</style>
