<template>
  <div id="container">
    <GetDropFile @droppedFile="getFile" @selectedFile="getFile" />
    <p>file: {{ dropFile.name }}</p>
  </div>
</template>

<script>
import GetDropFile from './GetDropFile.vue';
import { ref } from 'vue';
export default {
  components: {
    GetDropFile
  },
  setup () {
    const dropFile = ref("")
    const getFile = (value) => {
      dropFile.value = value
      console.log(dropFile.value)
    }
    return {
      dropFile , getFile
    }
  }
}
</script>

<style scoped>
#container {
  @apply flex flex-col items-center gap-4 h-screen justify-center
}
</style>