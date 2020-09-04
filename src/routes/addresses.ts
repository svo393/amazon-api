import Router from 'express'
import addressService from '../services/addressService'
import userAddressService from '../services/userAddressService'
import { checkAddressUpdate, checkNewAddress, checkNewUserAddress } from '../utils/inputValidator'
import { requireAuth } from '../utils/middleware'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  const addressCreateInput = checkNewAddress(req)
  const addedAddress = await addressService.addAddress(addressCreateInput, req)
  res.status(201).json(addedAddress)
})

router.get('/:addressID', async (req, res) => {
  const address = await addressService.getAddressByID(req)
  res.json(address)
})

router.put('/:addressID', requireAuth, async (req, res) => {
  const addressUpdateInput = checkAddressUpdate(req)
  const updatedAddress = await addressService.updateAddress(addressUpdateInput, req)
  res.json(updatedAddress)
})

router.delete('/:addressID', requireAuth, async (req, res) => {
  const deletedAddress = await addressService.deleteAddress(req)
  res.json(deletedAddress)
})

router.post('/:addressID/userAddresses', requireAuth, async (req, res) => {
  const userAddressCreateInput = checkNewUserAddress(req)
  const addedUserAddress = await userAddressService.addUserAddress(userAddressCreateInput, req)
  res.status(201).json(addedUserAddress)
})

export default router
