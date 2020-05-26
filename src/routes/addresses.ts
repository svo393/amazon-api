import Router from 'express'
import addressService from '../services/addressService'
import inputValidator from '../utils/inputValidator'
import shield from '../utils/shield'

const router = Router()

router.post('/', async (req, res) => {
  shield.isLoggedIn(res)
  const addressCreateInput = inputValidator.checkNewAddress(req.body)
  const addedAddress = await addressService.addAddress(addressCreateInput, res)
  res.status(201).json(addedAddress)
})

router.get('/', async (req, res) => {
  const addressFetchInput = inputValidator.checkAddressesFetch(req.query)
  const addresses = await addressService.getAddresses(addressFetchInput)
  res.json(addresses)
})

router.get('/:addressID', async (req, res) => {
  const address = await addressService.getAddressByID(Number(req.params.addressID))
  res.json(address)
})

export default router
