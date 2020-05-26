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

// router.get('/', async (req, res) => {
//   shield.isSameUser(req, res, 'query')
//   const userAddressFetchInput = inputValidator.checkFetchUserAddresses(req.query)
//   const userAddresses = await userAddressService.getUserAddresss(userAddressFetchInput)
//   res.json(userAddresses)
// })

// router.put('/', async (req, res) => {
//   shield.isSameUser(req, res, 'query')
//   const userAddressUpdateInput = inputValidator.checkUpdateUserAddresses(req.query)
//   const userAddresses = await userAddressService.getUserAddresss(userAddressUpdateInput)
//   res.json(userAddresses)
// })

// router.delete('/:userID/:follows', async (req, res) => {
//   shield.isSameUser(req, res, 'params')
//   await userAddressService.deleteUserAddress(Number(req.params.userID), Number(req.params.follows))
//   res.status(204).end()
// })

export default router
