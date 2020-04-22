import patients from '../../data/patients'
import { NewPatient, PublicPatient, Patient } from '../types'

const getPatients = (): Patient[] => patients

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) =>
    ({ id, name, dateOfBirth, gender, occupation }))
}

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuidv4()
  }
  patients.push(newPatient)
  return newPatient
}

const findByID = (id: string): Patient | null => {
  const patient = patients.find((p) => p.id === id)
  return patient || null
}

// const findByID = (id: string): NonSensitivePatient | null => {
//   const patient = patients.find((p) => p.id === id)
//   return patient
//     ? {
//       id: patient.id,
//       name: patient.name,
//       dateOfBirth: patient.dateOfBirth,
//       gender: patient.gender,
//       occupation: patient.occupation
//     }
//     : null
// }

export default {
  addItem,
  getItems,
  getPublicItems,
  getItemByID,
  getPublicItemByID
  updateItem,
  deleteItem
}
