<script setup>
import { useRoute } from 'vitepress'
import {
  versions,
  switchVersion
} from '../../utils/versions'

const route = useRoute()

function onChange(e) {
  window.location.href = switchVersion(e.target.value, route.path)
}
</script>

<template>
  <select
      class="version-switcher"
      :value="route.path.match(/^\/(v\d+|master)\//)?.[1]"
      @change="onChange"
  >
    <option
        v-for="(item, key) in versions"
        :key="key"
        :value="key"
    >
      {{ item.text }}
    </option>
  </select>
</template>

<style scoped>
.version-switcher {
  margin-left: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
}
</style>