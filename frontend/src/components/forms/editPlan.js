import FormTemplate from "./template";

export const EditPlanForm = () => (
  <FormTemplate
    title='Edit plan'
    status='editing failed. Cannot change name'
    statusType='error'
    buttonText='edit'
    onSubmit={(data) => console.log("Edit Plan Data:", data)}
    fields={[{ name: 'name', type: 'text', placeholder: 'name', validation: { required: "name is required" } },
             { name: 'maxHomes', type: 'number', placeholder: 'max homes' },
             { name: 'price', type: 'number', placeholder: 'price' },
             { name: 'duration', type: 'number', placeholder: 'duration (days)' }]} 
  />
);