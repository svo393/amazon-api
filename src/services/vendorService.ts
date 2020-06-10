import { Request } from 'express'
import { Vendor, VendorInput } from '../types'
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

  if (!addedVendor) {
    throw new StatusError(409, `Vendor with name "${vendorInput.name}" already exists`)
  }
  return addedVendor
}

type VendorListData = Vendor & { productCount: number }

const getVendors = async (): Promise<VendorListData[]> => {
  return await db('vendors as v')
    .select('v.vendorID', 'v.name')
    .count('p.productID as productCount')
    .joinRaw('JOIN products as p USING ("vendorID")')
    .groupBy('v.vendorID')
}

const getVendorByID = async (req: Request): Promise<VendorListData> => {
  const vendor: VendorListData = await db<Vendor>('vendors as v')
    .first('v.vendorID', 'name')
    .where('vendorID', req.params.vendorID)
    .count('p.productID as productCount')
    .joinRaw('JOIN products as p USING ("vendorID")')
    .groupBy('v.vendorID')

  if (!vendor) throw new StatusError(404, 'Not Found')
  return vendor
}

const updateVendor = async (vendorInput: VendorInput, req: Request): Promise<Vendor> => {
  const [ updatedVendor ]: Vendor[] = await db('vendors')
    .update(vendorInput, [ '*' ])
    .where('vendorID', req.params.vendorID)

  if (!updatedVendor) throw new StatusError(404, 'Not Found')
  return updatedVendor
}

export default {
  addVendor,
  getVendors,
  getVendorByID,
  updateVendor
}
