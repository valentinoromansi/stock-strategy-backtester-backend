import { GraphEntity } from "./graph-entity"
import { GraphPositionType } from "../types/graph-position-type"

/*
Entity => price or indicator
id defines entity moved from current price => entity[0] would be current entity, entity[2] would me 2 entities away form current entity
{
	"entity1":
		"id1": "0"
		"name1": "open",
	"position": "below",
	"positionOffset": 10 // used as percentage
	"entity2":
		"id2": "0",
		"name2": "EMA9",
}
*/
export class StrategyRule {
  graphEntity1: GraphEntity
  position: GraphPositionType
  positionOffset: number
  graphEntity2: GraphEntity
}
