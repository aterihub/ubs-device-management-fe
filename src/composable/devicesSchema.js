import * as yup from 'yup'

export const addDeviceSchema = yup.object({

  deviceName: yup.string().required().label('Device Name'),
  IMEINumber: yup.string().required().label('IMEI Number'),
  SIMNumber: yup.number().required().label('SIM Number'),
  // simInfo: yup.string().label('Type')
  // notes: yup.string().required().label('Coordinate'),
});

export const updateDeviceSchema = yup.object({
  deviceName: yup.string().required().label('Device Name'),
  deviceType: yup.string().required().label('Device Type'),
  SIMNumber: yup.number().required().label('SIM Number'),
}); 