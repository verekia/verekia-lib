// @flow

import cond from '../cond'

const knexPgUpsertOne = async (
  queryBuilder: Object,
  whereObject: Object,
  updateObject: Object,
  insertObject: Object,
  returningClause?: string | Array<string>,
) => {
  const UPDATE_TEXT = 'update'
  const INSERT_TEXT = 'insert'
  const selectResult = await queryBuilder.where(whereObject)
  return cond(
    [
      [
        selectResult.length === 0,
        async () => {
          const insertResult = await queryBuilder.insert(insertObject).returning(returningClause)
          return returningClause ? { operation: INSERT_TEXT, result: insertResult[0] } : INSERT_TEXT
        },
      ],
      [
        selectResult.length === 1,
        async () => {
          const updateResult = await queryBuilder
            .where(whereObject)
            .update(updateObject)
            .returning(returningClause)
          return returningClause ? { operation: UPDATE_TEXT, result: updateResult[0] } : UPDATE_TEXT
        },
      ],
    ],
    () => {
      throw Error('More than one row found for knexPgUpsertOne')
    },
  )
}

export default knexPgUpsertOne
