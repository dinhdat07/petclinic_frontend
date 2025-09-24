import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../lib/api';
import { Owner } from '../../types';
import OwnerInformation from './OwnerInformation';
import PetsTable from './PetsTable';

function OwnersPage() {
  const { ownerId } = useParams();
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

  if (loading) {
    return <p>Loading owner...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>Owner Details</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!owner) {
    return <p>No owner found.</p>;
  }

  return (
    <span>
      <OwnerInformation owner={owner} />
      <PetsTable owner={owner} />
    </span>
  );
}

export default OwnersPage;
