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

  public toggle (id: string | number, typeName: string): void {
    this.$emit('toggle', { typeName, id })
  }
}
</script>

<style lang="scss">
@import '../assets/scss/variable.scss';

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
    border-bottom: 1px dashed rgb(210, 210, 210);

    .text {
      flex-shrink: 0;
      text-align: right;
      font-size: 14px;
    }

    .el-radio-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-left: 10px;

      .el-radio-button {
        margin: 3px 0;
      }

      .el-radio-button__inner {
        border: none;
        border-radius: 4px;
      }
      .is-active {
        .el-radio-button__inner {
          background: $black;
          box-shadow: none;
        }
      }
    }

    .el-input {
      width: 260px;
      margin-right: 10px;
    }
  }
}
</style>
