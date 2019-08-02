import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async get(endpoint, payload, token): Promise<Types.ResponseData> {
    if (token) this.apisauce.setHeader('Authorization', `Bearer ${token}`)
    const response: ApiResponse<any> = await this.apisauce.get(endpoint, payload)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      return { kind: "ok", payload: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async post(endpoint, payload, token): Promise<Types.ResponseData> {
    if (token) this.apisauce.setHeader('Authorization', `Bearer ${token}`)
    const response: ApiResponse<any> = await this.apisauce.post(endpoint, payload)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      return { kind: "ok", payload: response.data }
    } catch {
      return { kind: "bad-data" }
    }
  }

}
