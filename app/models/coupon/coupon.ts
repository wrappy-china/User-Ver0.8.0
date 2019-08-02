import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const CouponModel = types
  .model("Coupon")
  .props({
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    status: types.optional(types.string, ""),
    value: types.optional(types.number, 0),
    expiry: types.optional(types.string, ""),
    color: types.optional(types.string, ""),
    initial: types.optional(types.string, ""),
    checkmark: types.optional(types.string, ""),
  })
  .views(self => ({}))
  .actions(self => ({
    setId(value: string) {
      self.id = value
    },
    setName(value: string) {
      self.name = value
    },
    setStatus(value: string) {
      self.status = value
    },
    setValue(value: number) {
      self.value = value
    },
    setExpiry(value: string) {
      self.expiry = value
    },
    setColor(value: string) {
      self.color = value
    },
    setInitial(value: string) {
      self.initial = value
    },
    setCheckmark(value: string) {
      self.checkmark = value
    },
  }))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage). 
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type CouponType = Instance<typeof CouponModel>
export interface Coupon extends CouponType {}
type CouponSnapshotType = SnapshotOut<typeof CouponModel>
export interface CouponSnapshot extends CouponSnapshotType {}
