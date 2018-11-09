<template>
  <el-card
    class="box-card"
    v-loading="cardLoading">
    <div
      class="item"
      v-for="(item, index) in type"
      :key="index">
      <span
        class="text"
        :style="{ 'width': width }">
        {{ item.name }}：
      </span>
      <el-radio-group
        v-model="item.default"
        size="small"
        @change.native="toggle(item.default, item.typeName)">
        <transition-group
          name="list"
          tag="div">
          <el-radio-button
            v-for="child in item.list"
            :key="child.id"
            class="btn"
            :label="child.id"
            ref="radio">
            {{ child.name }}
          </el-radio-button>
        </transition-group>
      </el-radio-group>
    </div>
    <slot></slot>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Card extends Vue {
  @Prop({ default: false })
  private cardLoading!: boolean

  @Prop({ default: () => [] })
  private type!: any[]

  @Prop({ default: '40px' })
  private width!: string

  public toggle (e: string | number, typeName: string): void {
    this.$emit('toggle', { typeName, id: e })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables.scss';

.box-card {
  border: none;

  .el-card-body {
    padding-bottom: 0;
  }

  .item:last-child {
    border-bottom: 0;
    margin-top: 20px;
  }

  .item {
    display: flex;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 10px;
    line-height: 34px;
    border-bottom: 1px dashed rgba(210, 210, 210);

    .text {

    }
  }
}
</style>
