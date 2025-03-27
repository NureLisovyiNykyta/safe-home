import FormTemplate from "./template";

export const LoginForm = () => (
  <FormTemplate
    title='Connect a system'
    status='login successful. Redirecting...'
    statusType='success'
    buttonText='log in'
    onSubmit={(data) => console.log("Login Data:", data)}
    fields={[{ name: 'email', type: 'email', placeholder: 'email', validation: { required: "email is required" } },
    {
      name: 'password', type: 'password', placeholder: 'password',
      validation: { required: "password is required", minLength: { value: 8, message: "password must be at least 8 characters" } }
    }]}
  />
);