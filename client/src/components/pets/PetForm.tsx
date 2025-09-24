import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ApiError, FieldErrorPayload } from '../../lib/api';
import { PetFormValues, PetType } from '../../types';

interface PetFormProps {
  title: string;
  submitLabel: string;
  initialValues: PetFormValues;
  petTypes: PetType[];
  ownerName: string;
  onSubmit: (values: PetFormValues) => Promise<void>;
}

type FieldErrors = Partial<Record<keyof PetFormValues, string>>;

const createFieldMap = (errors?: FieldErrorPayload[]): FieldErrors => {
  if (!errors) {
    return {};
  }

  return errors.reduce<FieldErrors>((acc, item) => {
    if (item.field) {
      acc[item.field as keyof PetFormValues] = item.message;
    }
    return acc;
  }, {});
};

const validate = (values: PetFormValues): FieldErrors => {
  const errors: FieldErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }
  if (!values.birthDate) {
    errors.birthDate = 'Birth date is required';
  }
  if (values.typeId === '' || values.typeId === undefined || values.typeId === null) {
    errors.typeId = 'Pet type is required';
  }
  return errors;
};

function PetForm({ title, submitLabel, initialValues, petTypes, ownerName, onSubmit }: PetFormProps) {
  const [values, setValues] = useState<PetFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
    setFieldErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const typeOptions = useMemo(
    () => petTypes.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [petTypes],
  );

  const updateField = <T extends keyof PetFormValues>(key: T) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value =
      key === 'typeId'
        ? event.target.value === ''
          ? ''
          : Number(event.target.value)
        : event.target.value;
    setValues((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    if (Object.keys(validation).length > 0) {
      setFieldErrors(validation);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(values);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        setFieldErrors((prev) => ({ ...prev, ...createFieldMap(error.payload?.fieldErrors) }));
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Unexpected error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2>{title}</h2>
      <form className="form-horizontal" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="col-sm-2 control-label">Owner</label>
          <div className="col-sm-10">{ownerName}</div>
        </div>

        <div className={`form-group ${fieldErrors.name ? 'has-error' : ''}`}>
          <label className="col-sm-2 control-label" htmlFor="name">
            Name
          </label>
          <div className="col-sm-10">
            <input
              id="name"
              name="name"
              className="form-control"
              value={values.name}
              onChange={updateField('name')}
            />
            {fieldErrors.name && <span className="help-block">{fieldErrors.name}</span>}
          </div>
        </div>

        <div className={`form-group ${fieldErrors.birthDate ? 'has-error' : ''}`}>
          <label className="col-sm-2 control-label" htmlFor="birthDate">
            Birth date
          </label>
          <div className="col-sm-10">
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="form-control"
              value={values.birthDate}
              onChange={updateField('birthDate')}
            />
            {fieldErrors.birthDate && <span className="help-block">{fieldErrors.birthDate}</span>}
          </div>
        </div>

        <div className={`form-group ${fieldErrors.typeId ? 'has-error' : ''}`}>
          <label className="col-sm-2 control-label" htmlFor="typeId">
            Type
          </label>
          <div className="col-sm-10">
            <select
              id="typeId"
              name="typeId"
              className="form-control"
              value={values.typeId === '' ? '' : String(values.typeId)}
              onChange={updateField('typeId')}
            >
              <option value="">Select a type...</option>
              {typeOptions.map((type) => (
                <option value={type.id} key={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {fieldErrors.typeId && <span className="help-block">{fieldErrors.typeId}</span>}
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
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default PetForm;

