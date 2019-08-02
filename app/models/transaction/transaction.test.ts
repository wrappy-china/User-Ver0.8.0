import { TransactionModel, Transaction } from "./transaction"

test("can be created", () => {
  const instance: Transaction = TransactionModel.create({})

  expect(instance).toBeTruthy()
})