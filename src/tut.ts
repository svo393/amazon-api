import Knex from 'knex'
import knexConfig from '../db/knexfile'

const knex = Knex(knexConfig.test)

// const subQuery = knex('customers as c')
//   .select('customer_id')
//   .where('points', '>=', 2000)

const query = knex('users')

// .groupBy('customer_id', 'first_name')
// .count('customer_id')
// .where('customer_id', 'in', subQuery)
// .insert([
//   { id: '1', name: 'John Smith' },
//   { id: '2', name: 'Jane Smith' }
// ], [ 'id', 'name' ])
// .limit(3).offset(6)
// .raw(
//   `SELECT *, quantity * unit_price as total_price
//   FROM order_items
//   WHERE order_id = 2
//   ORDER BY total_price DESC`
// )
// .orderBy([ 'state', { column: 'first_name', order: 'desc' } ])
// .where('address', 'ilike', '%avenue%')
// .whereRaw('last_name ~* ?', 'b[ru]|tt$')
// .whereRaw('quantity * unit_price > ?', 20)
// .whereBetween('birth_date', [ '1990-01-01', '2000-01-01' ])
// .whereIn('quantity_in_stock', [ 49, 38, 72 ])
// .where('order_date', '<=', '2018-01-01')
// .whereNull('shipped_date')
// .joinRaw('JOIN shippers as s USING (shipper_id)')
// .joinRaw('LEFT JOIN orders as o USING (customer_id)')
// .joinRaw('JOIN order_item_notes as oin USING (order_id, product_id)')
// .crossJoin('shippers as s' as any)

query.then((res) => console.log(res))
