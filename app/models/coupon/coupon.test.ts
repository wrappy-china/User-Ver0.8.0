import { CouponModel, Coupon } from "./coupon"

test("can be created", () => {
  const instance: Coupon = CouponModel.create({})

  expect(instance).toBeTruthy()
})