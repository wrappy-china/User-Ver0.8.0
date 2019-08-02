import { GeneralApiProblem } from "./api-problem"

export type ResponseData = { kind: "ok"; payload: any } | GeneralApiProblem
