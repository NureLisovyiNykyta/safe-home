import FormTemplate from "./template";

const RegisterForm = ({ onBack }) => (
  <FormTemplate
    title='Add new admin'
    status='admin added successfully. Closing...'
    statusType='success'
    buttonText='register'
    onSubmit={(data) => console.log("Register Data:", data)}
    fields={[{ name: 'name', type: 'text', placeholder: 'name', validation: { required: "name is required" } },
    { name: 'email', type: 'email', placeholder: 'email', validation: { required: "email is required" } },
    {
      name: 'password', type: 'password', placeholder: 'password',
      validation: { required: "password is required", minLength: { value: 8, message: "password must be at least 8 characters" } }
    }]}
    onBack={onBack}
  />
);

export default RegisterForm;
