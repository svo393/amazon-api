import Router from 'express'
import addressService from '../services/addressService'
import { checkNewAddress } from '../utils/inputValidator'
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

export default router
