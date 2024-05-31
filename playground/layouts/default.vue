<template>
  <ClientOnly fallback-tag="div">
    <Splitpanes>
      <Pane>
        <div class="w-full h-full">
          <MonacoEditor language="css" @update:modelValue="handleChangeScssStr" />
        </div>
      </Pane>
      <Pane>
        <div class="w-full h-full">
          <MonacoEditor language="css" :modelValue="compiledCssStr" />
        </div>
      </Pane>
    </Splitpanes>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { Pane, Splitpanes } from 'splitpanes'
import { MonacoEditor } from '~/components/monaco-editor';
import { compile } from '~/utils/compile';
import { presetScss } from './scss';

const compiledCssStr = ref('')
const runtimeConfig = useRuntimeConfig()
console.log(runtimeConfig);

const handleChangeScssStr = (scssStr: string) => {
  const compileScss = presetScss + '\n' + scssStr
  compile(compileScss).then(res => {
    compiledCssStr.value = res?.css || ''
  })
}
</script>
<style lang="scss"></style>