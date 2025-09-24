import { useEffect, useState } from 'react';
import { get } from '../lib/api';

interface ApiErrorPayload {
  status?: string;
  message?: string;
}

function ErrorPage() {
  const [error, setError] = useState<ApiErrorPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    get<ApiErrorPayload>('/api/oups')
      .then((payload) => {
        if (!cancelled) {
          setError(payload);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError({ message: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <img src="/images/pets.png" alt="Pets" />
      <h2>Something happened...</h2>
      {error ? (
        <div>
          {error.status && (
            <p>
              <strong>Status:</strong> {error.status}
            </p>
          )}
          <p>
            <strong>Message:</strong> {error.message ?? 'Unknown error'}
          </p>
        </div>
      ) : (
        <p>Loading error details...</p>
      )}
    </section>
  );
}

export default ErrorPage;
