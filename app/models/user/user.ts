import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    type: types.optional(types.string, ""),
    token: types.optional(types.string, ""),
    peer: types.optional(types.string, ""),
    active: types.optional(types.number, 0),
    inactive: types.optional(types.number, 0),
    expired: types.optional(types.number, 0),
    input: types.optional(types.number, 0),
    output: types.optional(types.number, 0),
  })
  .views(self => ({}))
  .actions(self => ({
    setId(value: string) {
      self.id = value
    },
    setName(value: string) {
      self.name = value
    },
    setType(value: string) {
      self.type = value
    },
    setToken(value: string) {
      self.token = value
    },
    setPeer(value: string) {
      self.peer = value
    },
    setActive(value: number) {
      self.active = value
    },
    setInactive(value: number) {
      self.inactive = value
    },
    setExpired(value: number) {
      self.expired = value
    },
    setInput(value: number) {
      self.input = value
    },
    setOutput(value: number) {
      self.output = value
    },
    clear() {
      self.id = "",
      self.name = "",
      self.token = "",
      self.peer = "",
      self.active = 0,
      self.inactive = 0,
      self.expired = 0
      self.input = 0,
      self.output = 0 
    }
  }))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage). 
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
