<template>
  <div class="heros">
    <card
      :type="type"
      :width="width"
      @toggle="changeType">
      <div class="item" style="margin-top: 10px">
        <span
          style="line-height: 38px"
          :style="{ width: width }"
          class="text">搜索：</span>
        <div class="el-radio-group">
          <el-input
            v-model="keyword"
            placeholder="姓名"
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
              inline
              class="table-expand">
              <el-form-item label="IP：">
                <span>{{ props.row.ip }}</span>
              </el-form-item>
              <el-form-item label="地址：">
                <span>{{ props.row.country }} {{ props.row.city }}</span>
              </el-form-item>
              <el-form-item label="浏览器：">
                <span v-html="uaParse(props.row.agent)"></span>
              </el-form-item>
              <el-form-item label="系统：">
                <span v-html="osParse(props.row.agent)"></span>
              </el-form-item>
              <el-form-item label="内容：">
                <span><span>{{ props.row.content }}</span></span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          min-width="120px"
          label-class-name="head"
          show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          width="160px"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="iconfont icon-date mar"></i>
            {{ scope.row.create_time | format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="120"
          label-class-name="head"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.state === 0
              ? '待审核'
              : scope.row.state === 1
                ? '通过'
                : '不通过' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="280"
          label-class-name="head"
          fixed="right">
          <template slot-scope="scope">
            <transition-group tag="span" name="btn">
              <el-button
                type="success"
                size="small"
                v-if="scope.row.state === 0 || scope.row.state === 2"
                @click="changeState(scope.row, 1)"
                key="1">通过</el-button>
              <el-button
                type="danger"
                size="small"
                v-if="scope.row.state === 0 || scope.row.state === 1"
                @click="changeState(scope.row, 2)"
                key="2">不通过</el-button>
              <el-button
                type="danger"
                size="small"
                key="3"
                @click="deleteHero(scope.row)"
                :disabled="scope.row.deleting">{{ scope.row.deleting ? '删除中' : '删 除' }}</el-button>
            </transition-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :page-size="16"
          @current-change="pageChange"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Card from '@/components/Card.vue'
import { uaParse, osParse } from '@/utils/ua-parse'

interface IItem {
  name: string
  id: number | string
}

interface IList {
  name: string
  typeName: string
  list: IItem[],
  default: string
}

@Component({ components: { Card } })
export default class Heros extends Vue {
  private width = '48px'
  private type: IList[] = [
    {
      name: '状态',
      typeName: 'state',
      list: [
        { name: '全部', id: '' },
        { name: '待审核', id: 0 },
        { name: '审核通过', id: 1 },
        { name: '审核不通过', id: 2 }
      ],
      default: ''
    }
  ]
  private keyword = ''
  private state!: StoreState.State
  private currentPage = 1

  private get fetch (): boolean {
    return this.$store.state.heros.fetch
  }

  private get list (): StoreState.Hero[] {
    return this.$store.state.heros.list
  }

  private get total (): number {
    return this.$store.state.heros.total
  }

  private changeType ({ id }: any): void {
    this.state = id
    this.getData()
  }

  private uaParse (content: string): string {
    return uaParse(content)
  }

  private osParse (content: string): string {
    return osParse(content)
  }

  private async getData (): Promise<void> {
    await this.$store.dispatch('heros/getHeros', {
      current_page: this.currentPage,
      page_size: 16,
      keyword: this.keyword,
      state: this.state
    })
  }

  private async changeState (row: StoreState.Hero, state: number): Promise<void> {
    await this.$store.dispatch('heros/patchHero', {
      _id: row._id,
      state
    })
  }

  private deleteHero (row: StoreState.Hero): void {
    this.$confirm('确定删除此数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const res: Ajax.AjaxResponse = await this.$store.dispatch('heros/deleteHero', {
        _id: row._id
      })
      if (res.code === 1) this.getData()
    }).catch(e => console.error(e))
  }

  private pageChange (page: number): void {
    this.currentPage = page
    this.getData()
  }

  private beforeCreate (): void {
    this.$store.dispatch('heros/getHeros', {
      current_page: 1,
      page_size: 16
    })
  }
}

</script>

<style lang="scss">

@import '../../assets/scss/variable.scss';

.heros {
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
    width: 40%;
  }

  .table-expand .el-form-item:last-child {
    width: 100%;
  }
}
</style>
