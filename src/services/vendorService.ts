import { Request } from 'express'
import { Vendor, VendorsFiltersInput, VendorInput } from '../types'
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

type VendorListRawData = Vendor & { productCount: string }
type VendorListData = Omit<VendorListRawData, 'productCount'> & {
  productCount: number;
}

const getVendors = async (vendorsFiltersinput: VendorsFiltersInput): Promise<VendorListData[]> => {
  const { q } = vendorsFiltersinput

  const rawVendors: VendorListRawData[] = await db<Vendor>('vendors as v')
    .select('v.vendorID', 'v.name')
    .count('p.productID as productCount')
    .joinRaw('LEFT JOIN products as p USING ("vendorID")')
    .groupBy('v.vendorID')

  let vendors

  vendors = rawVendors.map((v) => ({
    ...v,
    productCount: parseInt(v.productCount)
  }))

  if (q !== undefined) {
    vendors = vendors
      .filter((v) => v.name.toLowerCase().includes(q.toLowerCase()))
  }

  return vendors
}

const getVendorByID = async (req: Request): Promise<VendorListData> => {
  const rawVendor: VendorListRawData = await db<Vendor>('vendors as v')
    .first('v.vendorID', 'name')
    .where('v.vendorID', req.params.vendorID)
    .count('p.productID as productCount')
    .joinRaw('LEFT JOIN products as p USING ("vendorID")')
    .groupBy('v.vendorID')

  if (rawVendor === undefined) throw new StatusError(404, 'Not Found')

  const vendor = {
    ...rawVendor,
    productCount: parseInt(rawVendor.productCount)
  }

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
