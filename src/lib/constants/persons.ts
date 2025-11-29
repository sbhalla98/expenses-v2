export enum PERSONS {
  PERSON1 = "PERSON1",
  PERSON2 = "PERSON2",
  BOTH = "Both",
}

export const PAID_BY_OPTIONS = [
  { value: PERSONS.PERSON1, label: PERSONS.PERSON1 },
  { value: PERSONS.PERSON2, label: PERSONS.PERSON2 },
];

export const PAID_FOR_OPTIONS = [
  { value: PERSONS.PERSON1, label: PERSONS.PERSON1 },
  { value: PERSONS.BOTH, label: PERSONS.BOTH },
  { value: PERSONS.PERSON2, label: PERSONS.PERSON2 },
];
