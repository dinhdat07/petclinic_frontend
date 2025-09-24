import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../../lib/api';
import { Owner, PetFormValues, PetType } from '../../types';
import PetForm from './PetForm';

function EditPetPage() {
  const { ownerId, petId } = useParams();
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

  const pet = useMemo(() => {
    if (!owner || !petId) {
      return null;
    }
    return owner.pets.find((candidate) => String(candidate.id) === petId) ?? null;
  }, [owner, petId]);

  const initialValues = useMemo<PetFormValues | null>(() => {
    if (!pet) {
      return null;
    }
    return {
      name: pet.name,
      birthDate: pet.birthDate,
      typeId: pet.type?.id ?? '',
    };
  }, [pet]);

  const handleSubmit = async (values: PetFormValues) => {
    if (!owner || !pet || values.typeId === '') {
      throw new Error('Missing pet data');
    }

    const payload = {
      ...pet,
      name: values.name,
      birthDate: values.birthDate,
      typeId: Number(values.typeId),
      isNew: false,
    };

    await put(`/api/owners/${owner.id}/pets/${pet.id}`, payload);
    navigate(`/owners/${owner.id}`);
  };

  if (loading) {
    return <p>Loading pet...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>Edit Pet</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!owner || !pet || !initialValues) {
    return <p>Unable to load pet information.</p>;
  }

  return (
    <PetForm
      title="Edit Pet"
      submitLabel="Update Pet"
      initialValues={initialValues}
      petTypes={petTypes}
      ownerName={`${owner.firstName} ${owner.lastName}`}
      onSubmit={handleSubmit}
    />
  );
}

export default EditPetPage;
