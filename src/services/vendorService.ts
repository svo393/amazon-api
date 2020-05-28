import { Request } from 'express'
import { db } from '../../src/utils/db'
import { ProductListData, Vendor, VendorInput } from '../types'
import { getProductsQuery } from '../utils/queries'
import StatusError from '../utils/StatusError'

const addVendor = async (vendorInput: VendorInput): Promise<Vendor> => {
  const { name } = vendorInput

  const existingVendor = await db<Vendor>('vendors')
    .first('vendorID')
    .where('name', name)

  if (existingVendor) {
    throw new StatusError(409, `Vendor with name "${name}" already exists`)
  }

  const [ addedVendor ]: Vendor[] = await db<Vendor>('vendors')
    .insert(vendorInput, [ '*' ])

  return addedVendor
}

const getVendors = async (): Promise<Vendor[]> => {
  return await db<Vendor>('vendors')
}

type SingleVendorData = {
  name: string;
  products: ProductListData[];
}

const getVendorByID = async (req: Request): Promise<SingleVendorData> => {
  const vendors = await db<Vendor>('vendors')
  const [ vendor ] = vendors.filter((c) => c.vendorID === Number(req.params.vendorID))
  if (!vendor) throw new StatusError(404, 'Not Found')

  const products: ProductListData[] = await getProductsQuery
    .where('vendorID', req.params.vendorID)

  return { ...vendor, products }
}

const updateVendor = async (vendorInput: VendorInput, req: Request): Promise<SingleVendorData> => {
  const [ updatedVendor ] = await db<Vendor>('vendors')
    .update({ ...vendorInput }, [ 'vendorID' ])
    .where('vendorID', req.params.vendorID)

  if (!updatedVendor) throw new StatusError(404, 'Not Found')
  return getVendorByID(req)
}

export default {
  addVendor,
  getVendors,
  getVendorByID,
  updateVendor
}
