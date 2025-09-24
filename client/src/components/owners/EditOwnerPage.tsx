import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OwnerForm from './OwnerForm';
import { get, put } from '../../lib/api';
import { Owner, OwnerFormValues } from '../../types';

function EditOwnerPage() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
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

    get<Owner>(`/api/owners/${ownerId}`)
      .then((data) => {
        if (!cancelled) {
          setOwner(data);
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

  const initialValues = useMemo<OwnerFormValues | null>(() => {
    if (!owner) {
      return null;
    }
    return {
      firstName: owner.firstName,
      lastName: owner.lastName,
      address: owner.address,
      city: owner.city,
      telephone: owner.telephone,
    };
  }, [owner]);

  const handleSubmit = async (values: OwnerFormValues) => {
    if (!owner) {
      throw new Error('Owner data not loaded');
    }

    const payload = {
      ...owner,
      ...values,
      isNew: false,
    };

    const updated = await put<Owner>(`/api/owners/${owner.id}`, payload);
    navigate(`/owners/${updated.id}`);
  };

  if (loading) {
    return <p>Loading owner...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>Edit Owner</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!initialValues || !owner) {
    return null;
  }

  return (
    <OwnerForm
      title="Edit Owner"
      submitLabel="Update Owner"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}

export default EditOwnerPage;
