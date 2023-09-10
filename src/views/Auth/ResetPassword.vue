<template>
  <alert 
    :message ="status.message"
    :modalActive="modalActive"
    :isError="isError"
     @close="closeNotification" />

  <div class="content">
    <div class="form-wrapper">
      <div class="w-[120px] mb-10">
        <!-- <router-link :to="{name: 'Login Page'}"> 
          <MyButton class="outlined" label="back to login" @click="route" />
        </router-link> -->
      </div>
      <div class="text-left mb-[80px] flex flex-col">
        <h1 class="text-[28px] sm:text-[40px] font-bold">Forgot your password?</h1>
        <h2 class="text-[14px] sm:text-[28px] font-bold">Don’t worry, we got you.</h2>
      </div>
      <p class="opacity-60 text-base text-left font-normal mb-[24px]">Enter your registered email address to reset your password.</p>
      <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" class="w-full" >
        <form  @submit="handleSubmit($event, onSubmit)" class="form" >
          <BaseInput name="email" type="text" placeholder="you@email.com" class="outlined" label="Email"/>
          <MyButton type="submit" class="filled__blue" label="Send reset instruction" :loading="isLoading" />
        </form>
      </VeeForm>
    </div>
    <div class="flex justify-center items-center w-full">
      <div class="w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-cover bg-[url('@/assets/img/auth-logo.png')] "></div>
    </div>
  </div>
</template>
 
<script setup>
import BaseInput from '@/components/input/BaseInput.vue'
import MyButton from '@/components/button/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import { useAuthStore } from '@/stores/AuthStore'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { resetPasswordSchema } from '@/composable/validationSchemas'
import router from '@/router'

  const schema = resetPasswordSchema
 
  // auth with pinia
  const authStore = useAuthStore();
  const { status, isLoading } = storeToRefs(useAuthStore())
  const modalActive = ref(false)
  const isError = ref(false)

  const onSubmit = async (values, { resetForm }) => {
    await authStore.signIn(values)
    modalActive.value = true
    if (status.value.state == true) {
      isError.value = true
      setTimeout(closeNotification, 5000)
    } else {
      isError.value = false
      setTimeout(closeNotification, 5000)
      resetForm()
    }
    router.push({name:'MainReport'})
  }

  const closeNotification = () => {
    modalActive.value = false
  }

</script>
 

<style scoped>
.content {
  /* @apply flex flex-col items-center h-full max-w-7xl mx-auto px-[15px] overflow-auto h-screen */
  filter: drop-shadow(4px 4px 8px rgba(130, 130, 130, 0.16));
  @apply  
    w-full max-w-[1120px] h-[721px] m-auto px-[40px]
    rounded-2xl bg-white
    grid-flow-col grid
    /* justify-between m-auto relative px-[60px]  */
}

.form-wrapper {
  @apply m-auto w-fit
}

.form{
  @apply flex flex-col mb-4 w-full gap-8
}

.create-account {
  @apply flex flex-col gap-3 w-full text-left text-[#353535]
}

.service-name {
  @apply mb-8 font-medium text-[28px] text-[#353535] 
}
.logo {
  @apply m-auto max-w-[200px] mb-24
}


</style>