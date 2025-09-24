export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorShape {
  message?: string;
  fieldErrors?: FieldError[];
}

export interface BaseEntity {
  id: number;
  isNew?: boolean;
}

export interface NamedEntity extends BaseEntity {
  name: string;
}

export interface Person extends BaseEntity {
  firstName: string;
  lastName: string;
}

export interface Visit extends BaseEntity {
  date: string;
  description: string;
}

export interface PetType extends NamedEntity {}

export type PetTypeId = number;

export interface Pet extends NamedEntity {
  birthDate: string;
  type: PetType;
  visits: Visit[];
}

export interface Owner extends Person {
  address: string;
  city: string;
  telephone: string;
  pets: Pet[];
}

export interface Specialty extends NamedEntity {}

export interface Vet extends Person {
  specialties: Specialty[];
}

export interface OwnerFormValues {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
}

export interface PetFormValues {
  name: string;
  birthDate: string;
  typeId: PetTypeId | '';
}

export interface VisitFormValues {
  date: string;
  description: string;
}
