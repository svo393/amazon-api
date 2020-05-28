import Router from 'express'
import userAddressService from '../services/userAddressService'
import inputValidator from '../utils/inputValidator'
import { isSameUser } from '../utils/middleware'

const router = Router()

router.post('/', isSameUser('body'), async (req, res) => {
  const userAddressCreateInput = inputValidator.checkNewUserAddress(req)
  const addedUserAddress = await userAddressService.addUserAddress(userAddressCreateInput)
  res.status(201).json(addedUserAddress)
})

export default router
