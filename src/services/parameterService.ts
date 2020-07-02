import { Request } from 'express'
import { Parameter, ParameterInput, ProductParameter, ProductParametersInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addParameter = async (parameterInput: ParameterInput): Promise<Parameter> => {
  const { rows: [ addedParameter ] }: { rows: Parameter[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('parameters').insert(parameterInput) ]
  )

  if (addedParameter === undefined) {
    throw new StatusError(409, `Parameter with name "${parameterInput.name}" already exists`)
  }
  return addedParameter
}

const addProductParameters = async (productParameterInput: ProductParametersInput, req: Request): Promise<ProductParameter[]> => {
  const { rows: addedProductParameters }: { rows: ProductParameter[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('productParameters').insert(productParameterInput.map((pp) => ({
      ...pp,
      productID: Number(req.params.productID)
    }))) ]
  )

  if (addedProductParameters === undefined) {
    throw new StatusError(409, 'At least on of parameters is already added to the product')
  }
  return addedProductParameters
}

const getParameters = async (): Promise<Parameter[]> => await db('parameters')

const getParametersByProduct = async (req: Request): Promise<(ProductParameter & Parameter)[]> => {
  return await db('productParameters as pp')
    .join('parameters as p', 'pp.parameterID', 'p.parameterID')
    .where('pp.productID', req.params.productID)
}

const updateParameter = async (parameterInput: ParameterInput, req: Request): Promise<Parameter> => {
  const [ updatedParameter ]: Parameter[] = await db('parameters')
    .update(parameterInput, [ '*' ])
    .where('parameterID', req.params.parameterID)

  if (updatedParameter === undefined) throw new StatusError(404, 'Not Found')
  return updatedParameter
}

export default {
  addParameter,
  addProductParameters,
  getParameters,
  getParametersByProduct,
  updateParameter
}
