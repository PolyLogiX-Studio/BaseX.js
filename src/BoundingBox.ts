import { float3 } from './float3';
export class BoundingBox {
  public VERTEX_POINT_COUNT = 8
  public min:float3
}
export interface BoundingBoxJSON {
  min:number
  max:number
}