import { Submesh } from './Submesh';
import { SubmeshTopology } from './SubmeshTopology';
import { Point } from './Point';
import { MeshX } from './MeshX';
export class PointSubmesh extends Submesh{
  /**@override */
  public get Topology():SubmeshTopology {
    return SubmeshTopology.Points
  }

  public get IndiciesPerElement():number {
    return 1
  }

  public THIS(index:number):Point{
    return this.GetPoint(index)
  }

  constructor(mesh:MeshX){
    super(mesh)
  }
}