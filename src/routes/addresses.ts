import Router from 'express'
import addressService from '../services/addressService'
import { checkNewAddress } from '../utils/inputValidator'
import { isLoggedIn } from '../utils/middleware'

const router = Router()

router.post('/', isLoggedIn, async (req, res) => {
  const addressCreateInput = checkNewAddress(req)
  const addedAddress = await addressService.addAddress(addressCreateInput, res)
  res.status(201).json(addedAddress)
})

router.get('/:addressID', async (req, res) => {
  const address = await addressService.getAddressByID(req, res)
  res.json(address)
})

export default router
