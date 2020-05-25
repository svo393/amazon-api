import Knex from 'knex'
import knexConfig from '../../db/knexfile'
import env from '../../src/utils/config'

export const db = Knex(knexConfig[env.NODE_ENV as keyof typeof knexConfig])

export const dbTrans = async (cb: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const __tryTransaction = async (): Promise<void> => {
      try {
        const ret = await db.transaction(async (trx) => {
          await db
            .raw('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
            .transacting(trx)

          try {
            const result = await cb(trx)
            await trx.commit(result)
          } catch (err) {
            await trx.rollback(err)
          }
        })

        resolve(ret)
      } catch (err) {
        // if it was due to transaction serialization error then retry the transaction
        // see https://www.postgresql.org/docs/9.5/transaction-iso.html
        if (err.toString().includes('could not serialize access')) {
          __tryTransaction()
        } else {
          reject(err)
        }
      }
    }

    // kick things off
    __tryTransaction()
  })
}
