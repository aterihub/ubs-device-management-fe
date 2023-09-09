<template>
  <div 
    v-bind="$attrs"
    class="input-wrapper">
    <div 
      class="text-field">
      <label v-show="props.label" :for="name">{{ props.label }}</label>
      <textarea :id="name" :name="props.name" :type="props.type" v-model="value" :placeholder="props.placeholder" v-bind="$attrs" ></textarea>
    </div>
    <span class="error-message" v-show="errorMessage">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
  
  const props = defineProps(['name','label', 'placeholder','modelValue'])
  const{ value, errorMessage } = useField(props.name)

</script>

<style scoped>
.input-wrapper {
  @apply flex flex-col gap-1 text-left
}

.text-field {
  @apply flex flex-col gap-1
}

label {
  @apply  text-xs font-bold
}

textarea {
  @apply outline-none text-[14px] bg-transparent
}

.outlined .text-field {
  @apply  px-3 py-2
          rounded-lg border border-[#D1D1D6]
} 

.outlined input::placeholder {
  @apply text-[14px] text-[#9A9EA4]
} 

.error-message {
    @apply text-xs text-[#F15412] mt-1
}


</style>