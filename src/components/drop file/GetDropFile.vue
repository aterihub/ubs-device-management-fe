<template>
  <DropFile @drop.prevent="droppedFile" @change="selectedFile" />
  <!-- <p>file: {{ dropFile.name }}</p> -->
</template>

<script>
import DropFile from '@/components/drop file/DropFile.vue'
import { ref } from '@vue/reactivity'
export default {
  components: {
    DropFile
  },
  emits: ['droppedFile', 'selectedFile'],
  setup(props,{ emit }) {
    const dropFile = ref("")
    const droppedFile = (file) => {
      dropFile.value = file.dataTransfer.files[0]
      emit('droppedFile', dropFile.value )
    }
    const selectedFile = () => {
       dropFile.value = document.querySelector('.dropzoneFile').files[0]
       emit('selectedFile', dropFile.value)
    }
    return {
      dropFile, droppedFile, selectedFile
    }
  }

}
</script>

<style scoped>

</style>