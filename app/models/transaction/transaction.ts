import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const TransactionModel = types
  .model("Transaction")
  .props({
    code: types.optional(types.number, 0),
    status: types.optional(types.string, ""),
    reference: types.optional(types.string, "")
  })
  .views(self => ({}))
  .actions(self => ({
    setCode(value: number) {
      self.code = value
    },
    setStatus(value: string) {
      self.status = value
    },
    setReference(value: string) {
      self.reference = value
    }
  }))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage). 
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type TransactionType = Instance<typeof TransactionModel>
export interface Transaction extends TransactionType {}
type TransactionSnapshotType = SnapshotOut<typeof TransactionModel>
export interface TransactionSnapshot extends TransactionSnapshotType {}
