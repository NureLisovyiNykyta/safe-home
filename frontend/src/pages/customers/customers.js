import { EditPlanForm } from '../../components/forms/editPlan';
import { LoginForm } from '../../components/forms/login';
import { RegisterForm } from '../../components/forms/register';
import { ResetPasswordForm } from '../../components/forms/resetPassword';
import './customers.css';

const Customers = () => {
  return (
    <div className='page customers'>
      <LoginForm />
      <RegisterForm />
      <ResetPasswordForm />
      <EditPlanForm />
    </div>
  );
};

export default Customers;