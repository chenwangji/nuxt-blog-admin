<template>
  <div class="article">
    <card
      :type="type"
      @toggle="changeType($event)"
      :width="width">
      <div class="item" style="margin-top: 10px">
        <span
          class="text"
          style="line-height: 38px"
          :style="{ 'width': width }">
          搜索：
        </span>
        <div class="el-radio-group">
          <el-input
            v-model="keyword"
            placeholder="标题，描述"
            @keyup.enter.native="getData"
            size="small"></el-input>
          <el-button
            type="primary"
            @click.native="getData"
            size="small">查询</el-button>
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
              class="table-expand">
              <el-form-item label="标签">
                <span
                  v-for="item in props.row.tag"
                  :key="item._id"
                  style="margin-right: 10px">
                  {{ item.name }}
                </span>
              </el-form-item>
              <el-form-item label="关键字">
                <span>
                  {{ props.row.keyword }}
                </span>
              </el-form-item>
              <el-form-item label="描述">
                <span>
                  {{ props.row.descript }}
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="文章id"
          label-class-name="head"
          :width="100">
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          label-class-name="head"
          :width="280"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <a
              :href="`http://log.todyto.cn/article/${scope.row._id}`"
              target="_blank"
              class="article-link"
              rel="noopener noreferrer">
              {{ scope.row.title }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="发布日期"
          label-class-name="head"
          :width="180">
          <template slot-scope="scope">
            {{ scope.row.create_at | format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="分类"
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? 'Code' : scope.row.type === 2 ? 'Think' : 'Music' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="publish"
          label="公开"
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.publish === 1 ? '公开' : '私密' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          label-class-name="head">
          <template slot-scope="scope">
            {{ scope.row.state === 1 ? '发布' : '草稿' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          label-class-name="head"
          width="300">
          <template slot-scope="scope">
            <transition-group
              name="btn"
              tag="div">
              <el-button
                type="info"
                size="small"
                key="1"
                @click="edit(scope.row)">
                修改
              </el-button>
              <el-button
                v-if="scope.row.publish === 1"
                type="danger"
                size="small"
                key="2"
                @click="changeState(scope.row, 'publish', 2)">
                私密
              </el-button>
              <el-button
                v-else
                type="success"
                size="small"
                key="3"
                @click="changeState(scope.row, 'publish', 1)">
                公开
              </el-button>
              <el-button
                v-if="scope.row.state === 2"
                type="success"
                size="small"
                key="4"
                @click="changeState(scope.row, 'state', 1)">
                发布
              </el-button>
              <el-button
                v-else
                type="danger"
                size="small"
                key="5"
                @click="changeState(scope.row, 'state', 2)">
                草稿
              </el-button>
              <el-button
                v-if="scope.row.state === 1"
                type="danger"
                size="small"
                key="6"
                :disabled="scope.row.deleting"
                @click="dele(scope.row)">
                {{ scope.row.deleting ? '删除中' : '删 除' }}
              </el-button>
            </transition-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :page-size="10"
          @current-change="pageChange"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import Card from '@/components/Card.vue'

interface Item {
  name: string
  id: number | string
}

interface IList {
  name: string
  typeName: string
  list: Item[]
  default: string
}

interface IPara {
  tag: string
  type: StoreState.State
  publish: StoreState.State
  state: StoreState.State
  [index: string]: any
}

@Component({
  components: { Card }
  })
export default class Article extends Vue {
  private width = '48px'
  private type: IList[] = [
    {
      name: '标签',
      typeName: 'tag',
      list: [
        { name: '全部', id: '' },
        { name: 'JavaScript', id: 1 },
        { name: 'Vue', id: 2 },
        { name: 'HTTP', id: 3 }
      ],
      default: ''
    },
    {
      name: '分类',
      typeName: 'type',
      list: [
        { name: '全部', id: '' },
        { name: 'Code', id: 1 },
        { name: 'Think', id: 2 },
        { name: 'Music', id: 3 }
      ],
      default: ''
    },
    {
      name: '公开',
      typeName: 'publish',
      list: [
        { name: '全部', id: '' },
        { name: '私密', id: 1 },
        { name: '公开', id: 2 }
      ],
      default: ''
    },
    {
      name: '状态',
      typeName: 'state',
      list: [
        { name: '全部', id: '' },
        { name: '草稿', id: 1 },
        { name: '已发布', id: 2 }
      ],
      default: ''
    }
  ]
  private keyword = ''
  private para: IPara = {
    tag: '',
    type: '',
    publish: '',
    state: ''
  }
  private currentPage = 1

  private get list (): StoreState.Article[] {
    return this.$store.state.article.list
  }
  private get fetch (): boolean {
    return this.$store.state.article.fetch
  }
  private get total (): number {
    return this.$store.state.article.total
  }

  private get tag (): StoreState.Tag[] {
    return this.$store.state.tag.list
  }

  @Watch('tag', { deep: true })
  private getTag (val: StoreState.Tag[]): void {
    this.type[0].list = [
      { name: '全部', id: '' },
      ...val.map((item: StoreState.Tag) => ({ name: item.name, id: item._id || '' }))
    ]
  }

  // 筛选
  private changeType (e: { typeName: string, id: StoreState.State }) {
    this.para[e.typeName] = e.id
    this.getData()
  }

  // 分页
  private pageChange (val: number): void {
    this.currentPage = val
    this.getData()
  }

  // 获取文章列表
  private async getData () {
    await this.$store.dispatch('article/getArts', {
      ...this.para,
      current_page: this.currentPage,
      page_size: 10,
      keyword: this.keyword
    })
  }

  // 详情
  private edit (row: StoreState.Article): void {
    this.$router.push(`/article/release?id=${row._id}`)
  }

  // 修改状态
  private changeState (
    row: StoreState.Article,
    type: string,
    state: StoreState.State
  ): Promise<void> {
    interface Querys {
      _id: string
      state?: StoreState.State
      publish?: StoreState.State
      [index: string]: any
    }
    const querys: Querys = {
      _id: ''
    }
    querys._id = row._id as string
    querys[type] = state
    return this.$store.dispatch('article/patchArt', { ...querys })
  }

  // 删除文章
  private dele (row: StoreState.Article) {
    this.$confirm('求顶删除此文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async (): Promise<void> => {
      const res: Ajax.AjaxResponse = await this.$store.dispatch('article/deleteArt', { _id: row._id })
      if (res.code === 1) this.getData()
    }).catch(e => console.log(e))
  }

  private beforeCreate (): void {
    Promise.all([
      this.$store.dispatch('article/getArts', {
        current_page: 1,
        page_size: 10
      }),
      this.$store.dispatch('tag/getTags', {
        current_page: 1,
        page_size: 100
      })
    ])
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variable.scss';

.article {
  height: 100%;

  > .el-card {
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
  }

  .article-link {
    text-decoration: underline;
  }
}
</style>
