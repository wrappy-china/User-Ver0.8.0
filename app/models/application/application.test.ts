import { ApplicationModel, Application } from "./application"

test("can be created", () => {
  const instance: Application = ApplicationModel.create({})

  expect(instance).toBeTruthy()
})