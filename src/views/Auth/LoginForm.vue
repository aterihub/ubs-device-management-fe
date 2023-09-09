<template>
  <!-- <loading :loading="isLoading" /> -->
  <alert 
    :message ="status.message"
    :modalActive="modalActive"
    :isError="isError"
     @close="closeNotification" />

  <div class="content">
    <div class="login-wrapper">
      <img src="@/assets/img/blue-logogram.png" id="logo" class="logo">
      <h1 class="service-name">Login</h1>
      <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" class="w-full" >
        <form  @submit="handleSubmit($event, onSubmit)" class="form-wrapper" >
            <BaseInput name="email" type="text" placeholder="you@email.com" class="outlined" label="Email"/>
            <BaseInput name="password" type="password" placeholder="notyourbirthday" class="outlined" label="Password"/>
            <MyButton type="submit" class="filled__blue" label="Login" :loading="isLoading" />
        </form>
      </VeeForm>
      <div class="create-account">
        <!-- <router-link :to="{name: 'ResetPassword'}"> Forgot Password? </router-link> -->
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
  @apply flex flex-col items-center h-full max-w-7xl mx-auto px-[15px] overflow-auto
}

.login-wrapper {
  @apply w-full md:w-[400px] md:p-3 block m-auto mt-32
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
  @apply m-auto max-w-[200px] mb-20
}


</style>