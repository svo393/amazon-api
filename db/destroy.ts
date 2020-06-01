import { db } from '../src/utils/db'

const disconnect = async (): Promise<void> => await db.destroy()

disconnect()
