<template>
  <page
    class="skeleton-page"
    header-title="Skeleton 骨架"
  >
    <panel title="一般用法">
      <example-item>
        <at-skeleton
          style="margin: 10px;"
          transition=".3s ease"
          type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
        >
        </at-skeleton>
      </example-item>
    </panel>

    <panel title="加载">
      <template #controller>
        <at-switch
          :title="`${ loading ? '加载中' : '加载完毕'}`"
          :checked="loading"
          @change="handleChange"
        ></at-switch>
      </template>
      <example-item>
        <at-skeleton
          :loading="loading"
          type="list-item-avatar-two-line"
        >
          <at-flex
            justify="center"
            align-content="center"
          >
            <at-flex-item :size="2">
              <image
                class="profile_img"
                mode="cover"
                src="@/assets/images/logo_taro.png"
              />
            </at-flex-item>
            <at-flex-item>
              <view>this is the title</view>
              <view>this is the text</view>
            </at-flex-item>
          </at-flex>
        </at-skeleton>
      </example-item>
    </panel>
  </page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import {
  AtSkeleton,
  AtCard,
  AtFlex,
  AtFlexItem,
  AtSwitch,
} from 'taro-ui-vue3'

import {
  Page,
  Panel,
  ExampleItem
} from '../../components/demo-page'

import './index.scss'

export default defineComponent({
  name: "SkeletonDemo",

  setup() {
    const loading = ref(true)

    function handleChange(value) {
      loading.value = value
    }
    return {
      loading,
      handleChange
    }
  }
})
</script>