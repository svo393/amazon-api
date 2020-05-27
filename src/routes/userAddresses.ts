import Router from 'express'
import userAddressService from '../services/userAddressService'
import inputValidator from '../utils/inputValidator'
import { isSameUser, isSameUserOrAdmin } from '../utils/middleware'

const router = Router()

router.post('/', isSameUser('body'), async (req, res) => {
  const userAddressCreateInput = inputValidator.checkNewUserAddress(req.body)
  const addedUserAddress = await userAddressService.addUserAddress(userAddressCreateInput)
  res.status(201).json(addedUserAddress)
})

router.get('/', isSameUserOrAdmin('query'), async (req, res) => {
  const userAddressFetchInput = inputValidator.checkUserAddressesFetch(req.query)
  const userAddresses = await userAddressService.getUserAddresses(userAddressFetchInput)
  res.json(userAddresses)
})

router.put('/:addressID/:userID', isSameUser('params'), async (req, res) => {
  const userAddressUpdateInput = inputValidator.checkUserAddressesUpdate(req.body)
  const userAddresses = await userAddressService.updateUserAddress(userAddressUpdateInput, Number(req.params.addressID), Number(req.params.userID))
  res.json(userAddresses)
})

router.delete('/:addressID/:userID', isSameUser('params'), async (req, res) => {
  await userAddressService.deleteUserAddress(Number(req.params.addressID), Number(req.params.userID))
  res.status(204).end()
})

export default router
