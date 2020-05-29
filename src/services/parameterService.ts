import { Request } from 'express'
import { db } from '../utils/db'
import { ProductListData, Parameter, ParameterInput } from '../types'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addParameter = async (parameterInput: ParameterInput): Promise<Parameter> => {
  const { name } = parameterInput

  const existingParameter = await db<Parameter>('parameters')
    .first('parameterID')
    .where('name', name)

  if (existingParameter) {
    throw new StatusError(409, `Parameter with name "${name}" already exists`)
  }

  const [ addedParameter ]: Parameter[] = await db<Parameter>('parameters')
    .insert(parameterInput, [ '*' ])

  return addedParameter
}

const getParameters = async (): Promise<Parameter[]> => {
  return await db<Parameter>('parameters')
}

type SingleParameterData = {
  name: string;
  products: ProductListData[];
}

const getParameterByID = async (req: Request): Promise<SingleParameterData> => {
  const parameters = await db<Parameter>('parameters')
  const [ parameter ] = parameters.filter((c) => c.parameterID === Number(req.params.parameterID))
  if (!parameter) throw new StatusError(404, 'Not Found')

  const products: ProductListData[] = await getProductsQuery.clone()
    .where('parameterID', req.params.parameterID)

  return { ...parameter, products }
}

const updateParameter = async (parameterInput: ParameterInput, req: Request): Promise<SingleParameterData> => {
  const [ updatedParameter ] = await db<Parameter>('parameters')
    .update({ ...parameterInput }, [ 'parameterID' ])
    .where('parameterID', req.params.parameterID)

  if (!updatedParameter) throw new StatusError(404, 'Not Found')
  return getParameterByID(req)
}

export default {
  addParameter,
  getParameters,
  getParameterByID,
  updateParameter
}
