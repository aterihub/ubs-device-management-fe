<template>
  <div 
    @dragenter.prevent="toggleActive" 
    @dragleave.prevent="toggleActive" 
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{ 'active-dropzone': active }"
    class="dropzone">
    <span>Drag or Drop File</span>
    <span>OR</span>
    <label for="dropzoneFile"> Select File </label>
    <input type="file" id="dropzoneFile" class="dropzoneFile">
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: "DropZone",
  setup() {
    const active = ref(false)

    const toggleActive = () => {
      active.value = !active.value
    }
    return {
      active, toggleActive
    }
  }

}
</script>

<style scoped>
.dropzone {
  @apply w-[400px] h-[200px] flex flex-col justify-center items-center gap-4 
  bg-[#F5F8FA] border-[2px] rounded border-dashed
}

.active-dropzone {
  @apply bg-[#1363DF]/10 border-[#1363DF] transition-colors duration-700
}

label {
  @apply py-2 px-3 bg-[#1363DF] text-white rounded-lg hover:bg-[#1363DF]/80
}

input {
  @apply hidden
}
</style>