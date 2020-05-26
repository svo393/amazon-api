import Router from 'express'
import userAddressService from '../services/userAddressService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isSameUser(req, res, 'body')
  const userAddressCreateInput = inputValidator.checkNewUserAddress(req.body)
  const addedUserAddress = await userAddressService.addUserAddress(userAddressCreateInput)
  res.status(201).json(addedUserAddress)
})

router.get('/', async (req, res) => {
  shield.isSameUserOrAdmin(req, res, 'query')
  const userAddressFetchInput = inputValidator.checkUserAddressesFetch(req.query)
  const userAddresses = await userAddressService.getUserAddresses(userAddressFetchInput)
  res.json(userAddresses)
})

router.put('/:addressID/:userID', async (req, res) => {
  shield.isSameUser(req, res, 'params')
  const userAddressUpdateInput = inputValidator.checkUserAddressesUpdate(req.body)
  const userAddresses = await userAddressService.updateUserAddress(userAddressUpdateInput, Number(req.params.addressID), Number(req.params.userID))
  res.json(userAddresses)
})

router.delete('/:addressID/:userID', async (req, res) => {
  shield.isSameUser(req, res, 'params')
  await userAddressService.deleteUserAddress(Number(req.params.addressID), Number(req.params.userID))
  res.status(204).end()
})

export default router
