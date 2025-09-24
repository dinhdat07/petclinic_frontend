import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { Owner, PetFormValues, PetType } from '../../types';
import PetForm from './PetForm';

const NEW_PET: PetFormValues = {
  name: '',
  birthDate: '',
  typeId: '',
};

function NewPetPage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setError('Owner id is missing');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([get<PetType[]>('/api/pettypes'), get<Owner>(`/api/owners/${ownerId}`)])
      .then(([types, ownerResponse]) => {
        if (!cancelled) {
          setPetTypes(types);
          setOwner(ownerResponse);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const handleSubmit = async (values: PetFormValues) => {
    if (!owner || values.typeId === '') {
      throw new Error('Missing pet data');
    }

    const payload = {
      name: values.name,
      birthDate: values.birthDate,
      typeId: Number(values.typeId),
      isNew: true,
    };

    await post(`/api/owners/${owner.id}/pets`, payload);
    navigate(`/owners/${owner.id}`);
  };

  if (loading) {
    return <p>Loading pet form...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>Add Pet</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!owner) {
    return null;
  }

  return (
    <PetForm
      title="Add Pet"
      submitLabel="Add Pet"
      initialValues={NEW_PET}
      petTypes={petTypes}
      ownerName={`${owner.firstName} ${owner.lastName}`}
      onSubmit={handleSubmit}
    />
  );
}

export default NewPetPage;
