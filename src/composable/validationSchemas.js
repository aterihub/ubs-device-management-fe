import * as yup from 'yup'


export const loginSchema = yup.object({
  username: yup.string().required().email().label('email address'),
  password: yup.string().required().min(8),
});


export const registerSchema = yup.object({
  firstName: yup.string().required().label('firstname'),
  lastName: yup.string().required().label('lastname'),
  email: yup.string().required().email().label('email address'),
  password: yup.string().required().min(8), 
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export const resetPasswordSchema = yup.object({
  email: yup.string().required().email().label('email address'),
});

export const newPasswordSchema = yup.object({
  password: yup.string().required().min(8), 
  password_confirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});
