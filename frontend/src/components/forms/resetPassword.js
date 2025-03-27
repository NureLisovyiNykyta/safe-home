import FormTemplate from "./template";

export const ResetPasswordForm = () => (
  <FormTemplate
    title='Reset password'
    status='awaiting requests....'
    statusType='error'
    buttonText='send a request'
    onSubmit={(data) => console.log("Reset Password Data:", data)}
    fields={[{ name: 'email', type: 'email', placeholder: 'email', validation: { required: "email is required" } }]} 
  />
);