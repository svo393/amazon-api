import { Request } from 'express'
import { FormattedParameters, Parameter, ParameterCreateInput, ParameterUpdateInput, ProductParameter, ProductParameterInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addParameters = async (parameterInput: ParameterCreateInput): Promise<Parameter[]> => {
  return await db('parameters')
    .insert(parameterInput, [ '*' ])
}

const addProductParameter = async (productParameterInput: ProductParameterInput, req: Request): Promise<ProductParameter> => {
  const { rows: [ addedProductParameter ] }: { rows: ProductParameter[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('productParameters').insert(({
      ...productParameterInput,
      productID: Number(req.params.productID),
      parameterID: Number(req.params.parameterID)
    })) ]
  )

  if (addedProductParameter === undefined) {
    throw new StatusError(409, 'This parameter is already added to the product')
  }
  return addedProductParameter
}

const getParametersByProduct = async (req: Request): Promise<FormattedParameters> => {
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
    .update(parameterInput, [ '*' ])
    .where('parameterID', req.params.parameterID)

  if (updatedParameter === undefined) throw new StatusError(404, 'Not Found')
  return updatedParameter
}

export default {
  addParameters,
  addProductParameter,
  getParametersByProduct,
  updateParameter
}
