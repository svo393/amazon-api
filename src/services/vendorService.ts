import { PrismaClient, Vendor, VendorCreateInput, VendorGetPayload, VendorUpdateInput } from '@prisma/client'
import StatusError from '../utils/StatusError'

const prisma = new PrismaClient()

type VendorAllData = VendorGetPayload<{
  include: { items: true };
}>

const addVendor = async (vendorInput: VendorCreateInput): Promise<Vendor> => {
  const existingVendor = await prisma.vendor.findOne({
    where: { name: vendorInput.name },
    select: { id: true }
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

const getVendors = async (): Promise<VendorAllData[]> => {
  const vendors = await prisma.vendor.findMany({
    include: { items: true }
  })
  await prisma.disconnect()
  return vendors
}

const getVendorByID = async (id: string): Promise<VendorAllData> => {
  const vendor = await prisma.vendor.findOne({
    where: { id },
    include: { items: true }
  })
  await prisma.disconnect()

  if (!vendor) { throw new StatusError(404, 'Not Found') }

  return vendor
}

const updateVendor = async (vendorInput: VendorUpdateInput, id: string): Promise<VendorAllData> => {
  const updatedVendor = await prisma.vendor.update({
    where: { id },
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
  getVendorByID,
  updateVendor
}
