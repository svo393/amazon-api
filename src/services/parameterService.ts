import { Request } from 'express'
import { FormattedParameter, Parameter, ParameterInput, ProductParameter, ProductParameterInput } from '../types'
import { db } from '../utils/db'
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

const addProductParameter = async (productParameterInput: ProductParameterInput, req: Request): Promise<ProductParameter> => {
  const { value } = productParameterInput

  const existingProductParameter = await db<ProductParameter>('productParameters')
    .first('value')
    .where('value', value)

  if (existingProductParameter) {
    throw new StatusError(409, 'This product is already added to the parameter')
  }

  const [ addedProductParameter ]: ProductParameter[] = await db<ProductParameter>('productParameters')
    .insert({
      ...productParameterInput,
      productID: Number(req.params.productID),
      parameterID: Number(req.params.parameterID)
    }, [ '*' ])

  return addedProductParameter
}

const getParametersByProduct = async (req: Request): Promise<FormattedParameter[]> => {
  const parameters = await db('productParameters as pp')
    .leftJoin('parameters as p', 'p.parameterID', 'pp.parameterID')
    .where('pp.productID', req.params.productID)

  return parameters.reduce((acc, cur) => {
    return acc[cur.name]
      ? { ...acc, [cur.name]: [ ...acc[cur.name], cur ] }
      : { ...acc, [cur.name]: [ cur ] }
  }, {})
}

const updateParameter = async (parameterInput: ParameterInput, req: Request): Promise<Parameter> => {
  const [ updatedParameter ]: Parameter[] = await db('parameters')
    .update({ ...parameterInput }, [ '*' ])
    .where('parameterID', req.params.parameterID)

  if (!updatedParameter) throw new StatusError(404, 'Not Found')
  return updatedParameter
}

export default {
  addParameter,
  addProductParameter,
  getParametersByProduct,
  updateParameter
}
