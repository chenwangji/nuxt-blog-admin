<template>
  <div class="article">
    <card
      :type="type"
      @toggle="changeType($event)"
      :width="width">

    </card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import Card from '@/components/Card'

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

@Component
export default class Article extends Vue {
  private width = '48px'
  private type: IList[] = [
    {
      name: '标签',
      typeName: 'tag',
      list: [
        { name: '全部', id: '' },
        { name: 'JavaScript, id: 1 },
        { name: 'Vue', id: 2 },
        { name: 'HTTP', id: 3 }
      ],
      default: ''
    }
  ]
}
</script>

