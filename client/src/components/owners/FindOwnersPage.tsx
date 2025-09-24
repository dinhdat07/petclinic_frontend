import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { get } from '../../lib/api';
import { Owner } from '../../types';
import OwnersTable from './OwnersTable';

function FindOwnersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasLastNameParam = searchParams.has('lastName');
  const searchParamValue = searchParams.get('lastName') ?? '';

  const [filter, setFilter] = useState(searchParamValue);
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilter(searchParamValue);
  }, [searchParamValue]);

  useEffect(() => {
    if (!hasLastNameParam) {
      setOwners(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const query = encodeURIComponent(searchParamValue);
    get<Owner[]>(`/api/owners?lastName=${query}`)
      .then((data) => {
        if (!cancelled) {
          setOwners(data);
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
  }, [hasLastNameParam, searchParamValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = filter.trim();
    if (value.length > 0) {
      setSearchParams({ lastName: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <span>
      <section>
        <h2>Find Owners</h2>

        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="filter">
              Last name
            </label>
            <div className="col-sm-10">
              <input
                id="filter"
                className="form-control"
                name="filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                size={30}
                maxLength={80}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">
                Find Owner
              </button>
            </div>
          </div>
        </form>
      </section>

      {loading && <p>Searching owners...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <OwnersTable owners={owners ?? []} hasSearched={hasLastNameParam} />

      <Link className="btn btn-default" to="/owners/new">
        Add Owner
      </Link>
    </span>
  );
}

export default FindOwnersPage;
