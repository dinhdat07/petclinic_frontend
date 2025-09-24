import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { Owner, Pet, VisitFormValues } from '../../types';
import PetDetails from './PetDetails';

const INITIAL_VISIT: VisitFormValues = {
  date: '',
  description: '',
};

function VisitsPage() {
  const { ownerId, petId } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [visit, setVisit] = useState<VisitFormValues>(INITIAL_VISIT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

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

  useEffect(() => {
    setVisit(INITIAL_VISIT);
    setSubmitError(null);
    setShowValidation(false);
  }, [ownerId, petId]);

  const pet: Pet | null = useMemo(() => {
    if (!owner || !petId) {
      return null;
    }
    return owner.pets.find((candidate) => String(candidate.id) === petId) ?? null;
  }, [owner, petId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!owner || !pet) {
      setSubmitError('Pet information is missing.');
      return;
    }

    const hasDate = Boolean(visit.date);
    const hasDescription = Boolean(visit.description.trim());

    if (!hasDate || !hasDescription) {
      setShowValidation(true);
      setSubmitError('Both date and description are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await post(`/api/owners/${owner.id}/pets/${pet.id}/visits`, {
        date: visit.date,
        description: visit.description,
      });
      navigate(`/owners/${owner.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Failed to save visit');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading visit form...</p>;
  }

  if (error) {
    return (
      <section>
        <h2>Add Visit</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!owner || !pet) {
    return <p>Unable to load pet.</p>;
  }

  const showDateError = showValidation && !visit.date;
  const showDescriptionError = showValidation && !visit.description.trim();

  return (
    <section>
      <h2>Visits</h2>
      <strong>Pet</strong>
      <PetDetails owner={owner} pet={pet} />

      <form className="form-horizontal" onSubmit={handleSubmit} noValidate>
        <div className={`form-group ${showDateError ? 'has-error' : ''}`}>
          <label className="col-sm-2 control-label" htmlFor="visit-date">
            Date
          </label>
          <div className="col-sm-10">
            <input
              id="visit-date"
              name="date"
              type="date"
              className="form-control"
              value={visit.date}
              onChange={(event) => setVisit((prev) => ({ ...prev, date: event.target.value }))}
            />
            {showDateError && <span className="help-block">Date is required</span>}
          </div>
        </div>

        <div className={`form-group ${showDescriptionError ? 'has-error' : ''}`}>
          <label className="col-sm-2 control-label" htmlFor="visit-description">
            Description
          </label>
          <div className="col-sm-10">
            <textarea
              id="visit-description"
              name="description"
              className="form-control"
              value={visit.description}
              onChange={(event) =>
                setVisit((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={3}
            />
            {showDescriptionError && <span className="help-block">Description is required</span>}
          </div>
        </div>

        {submitError && (
          <div className="alert alert-danger" role="alert">
            {submitError}
          </div>
        )}

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className="btn btn-default" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Visit'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default VisitsPage;
