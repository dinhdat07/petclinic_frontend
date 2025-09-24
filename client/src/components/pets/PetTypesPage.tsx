import { useEffect, useState } from 'react';
import { get } from '../../lib/api';
import { PetType } from '../../types';

function PetTypesPage() {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    get<PetType[]>('/api/pettypes')
      .then((data) => {
        if (!cancelled) {
          setPetTypes(data);
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
  }, []);

  return (
    <section>
      <h2>Pet Types</h2>
      {loading && <p>Loading pet types...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {petTypes.map((petType) => (
              <tr key={petType.id}>
                <td>{petType.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default PetTypesPage;
