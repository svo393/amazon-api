import Router from 'express'
import addressService from '../services/addressService'
import userAddressService from '../services/userAddressService'
import { checkNewAddress, checkNewUserAddress } from '../utils/inputValidator'
import { requireAuth, requireCreator } from '../utils/middleware'

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

router.post('/:addressID/userAddresses', requireCreator('answers', 'answerID', 'params'), async (req, res) => {
  const userAddressCreateInput = checkNewUserAddress(req)
  const addedUserAddress = await userAddressService.addUserAddress(userAddressCreateInput, req)
  res.status(201).json(addedUserAddress)
})

export default router
