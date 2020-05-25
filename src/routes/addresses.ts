import Router from 'express'
import addresseservice from '../services/addressService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isLoggedIn(res)
  const addressCreateInput = inputValidator.checkNewAddress(req.body)
  const addedAddress = await addresseservice.addAddress(addressCreateInput, res)
  res.status(201).json(addedAddress)
})

// router.get('/', async (req, res) => {
//   const addressFetchInput = inputValidator.checkFetchAddresses(req.body)
//   const addresses = await addresseservice.getaddresses(addressFetchInput, res)
//   res.json(addresses)
// })

// router.get('/:addressID', async (req, res) => {
//   const address = await addresseservice.getAddressByID(Number(req.params.addressID), res)
//   res.json(address)
// })

// router.put('/:addressID', async (req, res) => {
//   shield.isRoot(res)
//   const addressUpdateInput = inputValidator.checkAddressUpdate(req.body)
//   const updatedItem = await addresseservice.updateAddress(addressUpdateInput, Number(req.params.addressID))
//   res.json(updatedItem)
// })

export default router
