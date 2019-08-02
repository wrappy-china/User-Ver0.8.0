import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ApplicationModel = types
  .model("Application")
  .props({})
  .views(self => ({}))
  .actions(self => ({}))

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage). 
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type ApplicationType = Instance<typeof ApplicationModel>
export interface Application extends ApplicationType {}
type ApplicationSnapshotType = SnapshotOut<typeof ApplicationModel>
export interface ApplicationSnapshot extends ApplicationSnapshotType {}
