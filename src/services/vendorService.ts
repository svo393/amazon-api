import { Request } from 'express'
import { Vendor, VendorFiltersInput, VendorInput } from '../types'
import { db } from '../utils/db'
import StatusError from '../utils/StatusError'

const addVendor = async (vendorInput: VendorInput): Promise<Vendor> => {
  const { rows: [ addedVendor ] }: { rows: Vendor[] } = await db.raw(
    `
    ? ON CONFLICT
      DO NOTHING
      RETURNING *;
    `,
    [ db('vendors').insert(vendorInput) ]
  )

  if (addedVendor === undefined) {
    throw new StatusError(409, `Vendor with name "${vendorInput.name}" already exists`)
  }
  return addedVendor
}

type VendorListData = Vendor & { productCount: number }

const getVendors = async (vendorFilterInput: VendorFiltersInput): Promise<VendorListData[]> => {
  const { name } = vendorFilterInput

  let vendors: VendorListData[] = await db<Vendor>('vendors as v')
    .select('v.vendorID', 'v.name')
    .count('p.productID as productCount')
    .joinRaw('JOIN products as p USING ("vendorID")')
    .groupBy('v.vendorID')

  if (name !== undefined) {
    vendors = vendors
      .filter((v) => v.name.toLowerCase().includes(name.toLowerCase()))
  }

  return vendors
}

const getVendorByID = async (req: Request): Promise<VendorListData> => {
  const vendor: VendorListData = await db<Vendor>('vendors as v')
    .first('v.vendorID', 'name')
    .where('v.vendorID', req.params.vendorID)
    .count('p.productID as productCount')
    .joinRaw('LEFT JOIN products as p USING ("vendorID")')
    .groupBy('v.vendorID')

  if (vendor === undefined) throw new StatusError(404, 'Not Found')
  return vendor
}

const updateVendor = async (vendorInput: VendorInput, req: Request): Promise<Vendor> => {
  const [ updatedVendor ]: Vendor[] = await db('vendors')
    .update(vendorInput, [ '*' ])
    .where('vendorID', req.params.vendorID)

  if (updatedVendor === undefined) throw new StatusError(404, 'Not Found')
  return updatedVendor
}

export default {
  addVendor,
  getVendors,
  getVendorByID,
  updateVendor
}
