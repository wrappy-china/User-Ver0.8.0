import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Environment } from "../environment"
import { RootStore } from "../root-store"
import { flow } from "mobx"
import { getEnv, getRoot } from "mobx-state-tree"
import { TransactionModel, Transaction } from "../transaction"
import { UserModel } from "../user";
import { Coupon, CouponModel } from "../coupon"
import moment from 'moment'
const randomColor = require('randomcolor')

const peer = "4C0F79BF-1238-4481-BC25-309F1E7CC916"

/**
 * Model description here for TypeScript hints.
 */
export const DataStoreModel = types
  .model("DataStore")
  .props({
    user: types.optional(UserModel, {}),
    transaction: types.optional(TransactionModel, {}),
    coupons: types.optional(types.array(CouponModel), []),
  })
  .views(self => ({
    get environment() {
      return getEnv(self) as Environment
    },
    get rootStore() {
      return getRoot(self) as RootStore
    },
    get statistic() {
      let total = 0
      let count = 0
      let coupons = []
      for (let item of self.coupons) {
        if (item.checkmark == "marked") {
          coupons.push(item.id)
          count = count + 1
          total = total + item.value
        }
      }
      return {
        count: count,
        total: total,
        coupons: coupons
      }
    }
  }))
  .actions(self => ({
    setTransaction(value: Transaction) {
      self.transaction = value
    },
    addCoupon(value: Coupon) {
      self.coupons.push(value)
    },
    clearCoupons() {
      self.coupons.clear()
    },

    /****** API CALLS ******/
    authenticate: flow(function* (payload) {
      self.transaction.setCode(-100)
      payload = {...payload, peer: peer}
      const result = yield self.environment.api.post("/user/authenticate", payload, undefined)
      self.transaction.setStatus(result.kind)
      if (result.kind === "ok") {
        const data = result.payload
        self.transaction.setCode(100)
        self.user.setId(data.user.id)
        self.user.setName(data.user.name)
        self.user.setType(data.user.type)
        self.user.setToken(data.token)
        self.user.setPeer(data.user.peer)
        self.user.setActive(data.user.active)
        self.user.setInactive(data.user.inactive)
        self.user.setExpired(data.user.expired)
        self.user.setInput(data.user.input)
        self.user.setOutput(data.user.output)
      }
    }),
    register: flow(function* (payload) {
      self.transaction.setCode(-100)
      payload = {...payload, peer: peer}
      const result = yield self.environment.api.post("/user/register", payload, undefined)
      self.transaction.setStatus(result.kind)
      if (result.kind === "ok") {
        const data = result.payload
        console.log(JSON.stringify(data.code))
        self.transaction.setCode(data.code)
      }
    }),
    refreshBalance: flow(function* () {
      const result = yield self.environment.api.get("/user/coupon/balance", {}, self.user.token)
      self.transaction.setCode(result.payload.code)
      self.transaction.setStatus(result.kind)
      if (result.kind === "ok") {
        const data = result.payload.data
        self.user.setActive(data.active)
        self.user.setInactive(data.inactive)
        self.user.setExpired(data.expired)
        self.user.setInput(data.input)
        self.user.setOutput(data.output)
      }
    }),
    listCoupons: flow(function* (payload) {
      var result;
      if(self.user.type=="STORE"){
        payload.filter="ALL";
        result=yield self.environment.api.post("/store/coupon/list", payload, self.user.token);
      }else{
        payload.filter="ACTIVE";
        result=yield self.environment.api.post("/user/coupon/list", payload, self.user.token);
      }
      self.transaction.setCode(result.payload.code)
      self.transaction.setStatus(result.kind)
      if (result.kind === "ok") {
        const coupons = result.payload.data
        self.clearCoupons()
        for (let coupon of coupons) {
          let item = CouponModel.create({
            id: coupon.id,
            name: coupon.name,
            value: coupon.value,
            status: coupon.status,
            color: randomColor({ luminosity: 'dark' }),
            initial: coupon.name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''),
            expiry: moment(coupon.expiryDate).format("MM-DD-YYYY hh:mma"),
            checkmark: "blank"
          })
          self.addCoupon(item)
        }
      }
    }), 
    
    transferCoupon: flow(function* (payload) {
      const result = yield self.environment.api.post("/user/coupon/transfer", payload, self.user.token)
      self.transaction.setCode(result.payload.code)
      self.transaction.setStatus(result.kind)
      if (result.kind === "ok") {
        self.transaction.setReference(result.payload.data[0])
      }
    }),
    redeemCoupon: flow(function* (payload) {
      const result = yield self.environment.api.post("/user/coupon/redeem", payload, self.user.token)
      self.transaction.setCode(result.payload.code)
      self.transaction.setStatus(result.kind)
      if (result.kind === "ok") {
        self.transaction.setReference(result.payload.data[0])
      }
    })
  }))

/**
* Un-comment the following to omit model attributes from your snapshots (and from async storage). 
* Useful for sensitive data like passwords, or transitive state like whether a modal is open.

* Note that you'll need to import `omit` from ramda, which is already included in the project!
*  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
*/

type DataStoreType = Instance<typeof DataStoreModel>
export interface DataStore extends DataStoreType { }
type DataStoreSnapshotType = SnapshotOut<typeof DataStoreModel>
export interface DataStoreSnapshot extends DataStoreSnapshotType { }
