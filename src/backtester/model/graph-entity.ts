import { GraphEntityType } from "../types/graph-entity-type"

export class GraphEntity {
  id: number
  type: GraphEntityType
  period: number // used only for indicators

  constructor(init?: Partial<GraphEntity>) {
    Object.assign(this, init)
  }
}
