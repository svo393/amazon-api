import { PrismaClient, Vendor, VendorCreateInput, VendorUpdateInput } from '@prisma/client'
import R from 'ramda'
import { ItemListData } from '../types'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

type VendorData = {
  name: string;
  items: ItemListData[];
}

const addVendor = async (vendorInput: VendorCreateInput): Promise<Vendor> => {
  const existingVendor = await prisma.vendor.findOne({
    where: { name: vendorInput.name }
  })

  if (existingVendor) {
    await prisma.disconnect()
    throw new StatusError(409, `Vendor with name "${vendorInput.name}" already exists`)
  }

  const addedVendor = await prisma.vendor.create({
    data: vendorInput
  })
  await prisma.disconnect()

  return addedVendor
}

const getVendors = async (): Promise<Vendor[]> => {
  const vendors = await prisma.vendor.findMany()
  await prisma.disconnect()

  return vendors
}

const getVendorByName = async (name: string): Promise<VendorData> => {
  const vendor = await prisma.vendor.findOne({
    where: { name },
    include: { items: true }
  })
  await prisma.disconnect()

  if (!vendor) throw new StatusError(404, 'Not Found')

  const filteredVendor = {
    ...vendor,
    items: vendor.items.map((i) => (
      R.pick([
        'id',
        'name',
        'listPrice',
        'price',
        'stars',
        'primaryMedia',
        'ratingCount'
      ])(i)
    ))
  }

  return filteredVendor
}

const updateVendor = async (vendorInput: VendorUpdateInput, name: string): Promise<VendorData> => {
  const updatedVendor = await prisma.vendor.update({
    where: { name },
    data: vendorInput,
    include: { items: true }
  })
  await prisma.disconnect()

  if (!updatedVendor) throw new StatusError(404, 'Not Found')

  return updatedVendor
}

export default {
  addVendor,
  getVendors,
  getVendorByName,
  updateVendor
}
