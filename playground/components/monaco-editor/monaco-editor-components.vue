<template>
  <div ref="monacoRef" class="h-full"></div>
</template>

<script lang="ts" setup>
import { MonacoEditorProps } from './helper'
import * as monaco from 'monaco-editor'
import { defineDebounceFn } from '@cc-heart/utils'

const props = defineProps(MonacoEditorProps)

const monacoRef = ref()
let monacoEditorInstance: monaco.editor.IStandaloneCodeEditor | null = null

const updateMonacoValue = (value: string) => {
  monacoEditorInstance?.setValue(value)
}

watchEffect(() => {
  updateMonacoValue(props.modelValue)
})

const getValue = () => {
  return monacoEditorInstance?.getValue()
}
const emits = defineEmits(['update:modelValue'])
const debounceUpdateModelValue = defineDebounceFn((event) => {
  emits('update:modelValue', getValue())
})

onMounted(() => {
  monacoEditorInstance = monaco.editor.create(monacoRef.value, {
    language: props.language,
    value: props.modelValue,
    folding: true,
    theme: props.theme,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    minimap: {
      enabled: props.minimapEnabled,
    },
    automaticLayout: true,
    renderValidationDecorations: 'on',
  })

  monacoEditorInstance.onDidChangeModelContent(debounceUpdateModelValue)
})

watch(
  () => props.language,
  () => {
    if (monacoEditorInstance) {
      monaco.editor.setModelLanguage(monacoEditorInstance.getModel()!, props.language)
    }
  }
)

defineExpose({
  updateMonacoValue,
  getValue,
})
</script>
