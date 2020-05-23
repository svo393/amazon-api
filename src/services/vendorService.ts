import db from '../../src/utils/db'
import R from 'ramda'
import { ItemListData, ProductListData, VendorInput, Vendor } from '../types'
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

const getVendorByID = async (vendorID: number): Promise<SingleVendorData> => {
  const vendors = await db<Vendor>('vendors')
  const [ vendor ] = vendors.filter((c) => c.vendorID === vendorID)
  if (!vendor) throw new StatusError(404, 'Not Found')

  const { rows: products }: { rows: ProductListData[] } = await db.raw(
    `SELECT
      "p"."title", "listPrice", "price", "primaryMedia", "p"."productID",
      AVG("r"."stars") as stars,
      COUNT("r"."ratingID") as ratingCount
    FROM products as p
    LEFT JOIN ratings as r USING ("productID")
    WHERE "vendorID" = ${vendorID}
    GROUP BY "p"."productID"`
  )

  return { ...vendor, products }
}

const updateVendor = async (vendorInput: VendorInput, vendorID: number): Promise<SingleVendorData> => {
  const [ updatedVendor ] = await db<Vendor>('vendors')
    .update({ ...vendorInput }, [ 'vendorID' ])
    .where('vendorID', vendorID)

  if (!updatedVendor) throw new StatusError(404, 'Not Found')
  return getVendorByID(updatedVendor.vendorID)
}

export default {
  addVendor,
  getVendors,
  getVendorByID,
  updateVendor
}
