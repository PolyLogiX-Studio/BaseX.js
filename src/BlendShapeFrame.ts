import { BlendShape } from './BlendShape';
import { float3 } from './float3';
import { MeshX } from './MeshX';
export class BlendShapeFrame {
  public BlendShape:BlendShape
  public Weight:number
  /**@internal */
  public positions:float3[]
  /**@internal */
  public normals:float3[]
  /**@internal */
  public tangents:float3[]

  public get Mesh():MeshX{
    return this.BlendShape.Mesh
  }

  constructor(shape:BlendShape, weight:number) {
    this.BlendShape = shape
    this.Weight =  weight
    this.Mesh.EnsureArray<float3>(true, this.positions, this.Mesh.VertexCapacity);
      if (shape.HasNormals)
        this.Mesh.EnsureArray<float3>(true, this.normals, this.Mesh.VertexCapacity);
      if (!shape.HasTangents)
        return;
      this.Mesh.EnsureArray<float3>(true, this.tangents, this.Mesh.VertexCapacity);
  }

  //TODO Deltas
}
