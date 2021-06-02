import { SubmeshTopology } from './SubmeshTopology';
import { BoundingBox } from './BoundingBox';
export class SubmeshMetadata {
  public elementCount!:number
  public topology!:SubmeshTopology
  public bounds!:BoundingBox
  constructor($b:SubmeshMetadataJSON){
    if ($b == null )return
    this.elementCount = $b.elementCount
    this.topology = $b.topology
    this.bounds = $b.bounds
  }
  toJSON():SubmeshMetadataJSON {
    return {
      elementCount:this.elementCount,
      topology:this.topology,
      bounds:this.bounds
    }
  }
}
export interface SubmeshMetadataJSON {
  elementCount:number
  topology:SubmeshTopology
  bounds:BoundingBox
}