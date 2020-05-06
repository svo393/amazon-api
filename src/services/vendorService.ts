import { PrismaClient, Vendor, VendorCreateInput, VendorUpdateInput } from '@prisma/client'
import R from 'ramda'
import { ItemPublicData } from '../types'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

type VendorData = {
  name: string;
  items: ItemPublicData[];
}

const addVendor = async (vendorInput: VendorCreateInput): Promise<Vendor> => {
  const existingVendor = await prisma.vendor.findOne({
    where: { name: vendorInput.name },
    select: { name: true }
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

const getVendors = async (): Promise<VendorData[]> => {
  const vendors = await prisma.vendor.findMany({
    include: { items: true }
  })
  await prisma.disconnect()

  const filteredVendors = vendors.map((v) => ({
    ...v,
    items: v.items.map((i) =>
      R.omit([
        'createdAt',
        'updatedAt',
        'userID'
      ])(i)
    )
  }))

  return filteredVendors
}

const getVendorByName = async (name: string): Promise<VendorData> => {
  const vendor = await prisma.vendor.findOne({
    where: { name },
    include: { items: true }
  })
  await prisma.disconnect()

  if (!vendor) { throw new StatusError(404, 'Not Found') }

  return vendor
}

const updateVendor = async (vendorInput: VendorUpdateInput, name: string): Promise<VendorAllData> => {
  const updatedVendor = await prisma.vendor.update({
    where: { name },
    data: vendorInput,
    include: { items: true }
  })
  await prisma.disconnect()

  if (!updatedVendor) { throw new StatusError(404, 'Not Found') }

  return updatedVendor
}

export default {
  addVendor,
  getVendors,
  getVendorByName,
  updateVendor
}
