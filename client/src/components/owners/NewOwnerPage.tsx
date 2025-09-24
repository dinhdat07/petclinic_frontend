import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerForm from './OwnerForm';
import { post } from '../../lib/api';
import { Owner, OwnerFormValues } from '../../types';

const createInitialValues = (): OwnerFormValues => ({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  telephone: '',
});

function NewOwnerPage() {
  const navigate = useNavigate();
  const initialValues = useMemo(createInitialValues, []);

  const handleSubmit = async (values: OwnerFormValues) => {
    const payload = {
      ...values,
      id: null,
      isNew: true,
      pets: [],
    };

    const owner = await post<Owner>('/api/owners', payload);
    navigate(`/owners/${owner.id}`);
  };

  return (
    <OwnerForm
      title="New Owner"
      submitLabel="Add Owner"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}

export default NewOwnerPage;
