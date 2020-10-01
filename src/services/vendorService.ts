import { Request } from 'express'
import { BatchWithCursor, Vendor, VendorInput, VendorsFiltersInput } from '../types'
import { defaultLimit } from '../utils/constants'
import { db } from '../utils/db'
import fuseIndexes from '../utils/fuseIndexes'
import sortItems from '../utils/sortItems'
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

const getVendors = async (vendorsFiltersinput: VendorsFiltersInput): Promise<BatchWithCursor<VendorListData>> => {
  const {
    page = 1,
    sortBy = 'groupID',
    q
  } = vendorsFiltersinput

  const rawVendors: VendorListRawData[] = await db<Vendor>('vendors as v')
    .select('v.vendorID', 'v.name')
    .count('p.productID as productCount')
    .leftJoin('products as p', 'v.vendorID', 'p.vendorID')
    .groupBy('v.vendorID')

  let vendors: VendorListData[]

  vendors = rawVendors.map((v) => ({
    ...v,
    productCount: parseInt(v.productCount)
  }))

  if (q !== undefined) {
    vendors = vendors
      .filter((_, i) =>
        fuseIndexes(vendors, [ 'name' ], q).includes(i))
  }

  const vendorsSorted = sortItems(vendors, sortBy)

  const totalCount = vendors.length
  const end = (page - 1) * defaultLimit + defaultLimit

  return {
    batch: vendorsSorted.slice((page - 1) * defaultLimit, (page - 1) * defaultLimit + defaultLimit),
    totalCount,
    hasNextPage: end < totalCount
  }
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
