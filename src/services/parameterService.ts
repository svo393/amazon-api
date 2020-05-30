import { Request } from 'express'
import { FormattedParameter, Parameter, ParameterCreateInput, ParameterUpdateInput, ProductParameter, ProductParameterInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addParameters = async (parameterInput: ParameterCreateInput): Promise<Parameter[]> => {
  return await db<Parameter>('parameters')
    .insert(parameterInput, [ '*' ])
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
    return acc[cur.parameterID]
      ? { ...acc, [cur.parameterID]: [ ...acc[cur.parameterID], cur ] }
      : { ...acc, [cur.parameterID]: [ cur ] }
  }, {})
}

const updateParameter = async (parameterInput: ParameterUpdateInput, req: Request): Promise<Parameter> => {
  const [ updatedParameter ]: Parameter[] = await db('parameters')
    .update({ ...parameterInput }, [ '*' ])
    .where('parameterID', req.params.parameterID)

  if (!updatedParameter) throw new StatusError(404, 'Not Found')
  return updatedParameter
}

export default {
  addParameters,
  addProductParameter,
  getParametersByProduct,
  updateParameter
}
