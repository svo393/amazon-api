import Router from 'express'
import userAddressService from '../services/userAddressService'
import { checkNewUserAddress } from '../utils/inputValidator'
import { requireSameUser } from '../utils/middleware'

const router = Router()

router.post('/', requireSameUser('body'), async (req, res) => {
  const userAddressCreateInput = checkNewUserAddress(req)
  const addedUserAddress = await userAddressService.addUserAddress(userAddressCreateInput)
  res.status(201).json(addedUserAddress)
})

export default router
