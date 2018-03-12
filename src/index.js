import {} from "./api"

import {} from "./constants"

export class Bosta {
  constructor(config = {}) {
    this.config(config)
  }

  create(config) {
    return new Bosta(config)
  }

  config(options) {
    return this
  }

  async deliver() {
    
  }

}

export const Accept = new Bosta()
export default Accept
