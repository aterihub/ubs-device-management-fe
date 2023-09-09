<template>
  <alert 
    :message ="status.message"
    :modalActive="modalActive"
    :isError="isError"
     @close="closeNotification" />

  <div class="content">
    <div class="login-wrapper">
      <img src="@/assets/img/ateri-typogram.png" id="logo" class="logo">
      <h1 class="service-name">Login</h1>
      <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" class="w-full" >
        <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
            <BaseInput name="username" type="text" placeholder="you@email.com" class="outlined" label="Email"/>
            <BaseInput name="password" type="password" placeholder="notyourbirthday" class="outlined" label="Password"/>
            <MyButton type="submit" class="filled__blue" label="Login" :loading="isLoading" />
        </form>
      </VeeForm>
      <div class="create-account">
        <router-link :to="{name: 'ResetPassword'}"> Forgot Password? </router-link>
      </div>
    </div>
    <div class="w-[662px] bg-cover bg-[url('@/assets/img/login-bg.png')] bg-center flex justify-center items-center">
      <div class="flex flex-col text-white text-left">
        <p class="text-2xl font-light">Welcome to</p>
        <p class="text-[40px] font-black">Fleet Management System</p>
        <p class="text-base font-light">Manage and monitor your Fleet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import BaseInput from '@/components/input/BaseInput.vue'
  import MyButton from '@/components/button/BaseButton.vue'
  import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
  import { useAuthStore } from '@/stores/AuthStore'
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { loginSchema } from '@/composable/validationSchemas'

  const schema = loginSchema
 
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
  }

  const closeNotification = () => {
    modalActive.value = false
  }

</script>
 

<style scoped>
.content {
  /* @apply flex flex-col items-center h-full max-w-7xl mx-auto px-[15px] overflow-auto h-screen */
  filter: drop-shadow(4px 4px 8px rgba(130, 130, 130, 0.16));
  @apply flex flex-row w-[1120px] h-[721px] rounded-2xl bg-white overflow-clip justify-between m-auto relative 
}

.login-wrapper {
  @apply w-[458px] px-[89px] mt-[95px]
}

.form-wrapper{
  @apply flex flex-col mb-4 w-full gap-4
}

.create-account {
  @apply flex flex-col gap-3 w-full text-left text-[#353535]
}

.service-name {
  @apply mb-8 font-medium text-[28px] text-[#353535] 
}
.logo {
  @apply m-auto max-w-[200px] mb-10
}


</style>