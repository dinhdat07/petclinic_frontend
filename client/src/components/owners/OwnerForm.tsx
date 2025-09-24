import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ApiError, FieldErrorPayload } from '../../lib/api';
import { OwnerFormValues } from '../../types';

interface OwnerFormProps {
  title: string;
  submitLabel: string;
  initialValues: OwnerFormValues;
  onSubmit: (values: OwnerFormValues) => Promise<void>;
}

type FieldErrors = Partial<Record<keyof OwnerFormValues, string>>;

const createFieldMap = (errors?: FieldErrorPayload[]): FieldErrors => {
  if (!errors) {
    return {};
  }
  return errors.reduce<FieldErrors>((acc, item) => {
    if (item.field) {
      acc[item.field as keyof OwnerFormValues] = item.message;
    }
    return acc;
  }, {});
};

const validate = (values: OwnerFormValues): FieldErrors => {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!values.address.trim()) {
    errors.address = 'Address is required';
  }
  if (!values.city.trim()) {
    errors.city = 'City is required';
  }
  if (!/^\d{1,10}$/.test(values.telephone.trim())) {
    errors.telephone = 'Telephone must be numeric with up to 10 digits';
  }
  return errors;
};

function OwnerForm({ title, submitLabel, initialValues, onSubmit }: OwnerFormProps) {
  const [values, setValues] = useState<OwnerFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
    setFieldErrors({});
    setSubmitError(null);
  }, [initialValues]);

  const updateField = (key: keyof OwnerFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
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
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
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

  const renderFormGroup = (
    label: string,
    field: keyof OwnerFormValues,
    type: string = 'text',
  ) => {
    const errorMessage = fieldErrors[field];
    return (
      <div className={`form-group ${errorMessage ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label" htmlFor={field}>
          {label}
        </label>
        <div className="col-sm-10">
          <input
            id={field}
            name={field}
            type={type}
            className="form-control"
            value={values[field]}
            onChange={updateField(field)}
          />
          {errorMessage && <span className="help-block">{errorMessage}</span>}
        </div>
      </div>
    );
  };

  return (
    <section>
      <h2>{title}</h2>
      <form className="form-horizontal" onSubmit={handleSubmit} noValidate>
        {renderFormGroup('First Name', 'firstName')}
        {renderFormGroup('Last Name', 'lastName')}
        {renderFormGroup('Address', 'address')}
        {renderFormGroup('City', 'city')}
        {renderFormGroup('Telephone', 'telephone')}
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

export default OwnerForm;
