import { Entry, Gender, NewEntry, NewPatient } from './types'

const isString = (param: any): param is string => {
  return typeof (param) === 'string' || param instanceof String
}

const parseAsString = (param: any, name: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${name}: ${param}`)
  }
  return param
}

const isDate = (param: string): boolean => {
  return Boolean(Date.parse(param))
}

const parseAsDate = (param: any, name: string): string => {
  if (!param || !isString(param) || !isDate(param)) {
    throw new Error(`Incorrect or missing ${name}: ${param}`)
  }
  return param
}

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param)
}

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${gender}`)
  }
  return gender
}

const parseEntries = (entries: any[]): Entry[] => {
  if (!entries || !entries.every((e) => isString(e))) {
    throw new Error(`Incorrect or missing entries: ${entries}`)
  }
  return entries
}

export const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseAsString(object.name, 'name'),
    occupation: parseAsString(object.occupation, 'occupation'),
    gender: parseGender(object.gender),
    ssn: parseAsString(object.ssn, 'ssn'),
    dateOfBirth: parseAsDate(object.dateOfBirth, 'dateOfBirth'),
    entries: parseEntries(object.entries)
  }
}

export const toNewEntry = (object: any): NewEntry => {
  return {
    ...object,
    description: parseAsString(object.description, 'description'),
    date: parseAsDate(object.date, 'date'),
    specialist: parseAsString(object.specialist, 'specialist')
  }
}

export const toNewItem = (object: any): object => object
export const toUpdatedItem = (body: object, cookies: object): object => body
export const toDeletedItem = (id: string, cookies: object): object => id
