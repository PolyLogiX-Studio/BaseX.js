import { float3 } from './float3';
import { floatQ } from './floatQ';
import { MeshX } from './MeshX';
import { VertexCollection } from './VertexCollection';
import { TriangleCollection } from './TriangleCollection';
import { PointCollection } from './PointCollection';
import { float4 } from './float4';
export abstract class MeshXShape {
  public Position:float3
  public Rotation:floatQ = floatQ.Identity
  public Scale:float3 = float3.One

  public Mesh!:MeshX
  
  public AllVertices:VertexCollection
  
  public AllTriangles:TriangleCollection
  
  public AllPoints:PointCollection

  constructor(mesh:MeshX){
    this.UpdateMesh(mesh)
    this.AllVertices = new VertexCollection();
    this.AllTriangles = new TriangleCollection();
    this.AllPoints = new PointCollection();
  }

  protected UpdateMesh(mesh:MeshX):void {
    this.Mesh = mesh
  }

  public abstract Update():void

  public Remove():void {
    this.RemoveGeometry()
    this.Mesh = null as unknown as MeshX
  }

  public RemoveGeometry():void{
    this.Mesh.RemoveTriangles(this.AllTriangles)
    this.Mesh.RemovePoints(this.AllPoints)
    this.Mesh.RemoveVertices(this.AllVertices)
    this.AllTriangles.Clear()
    this.AllPoints.Clear()
    this.AllVertices.Clear()
  }

  protected TransformVertices(normalsAndTangents:boolean):void
    {
      let local1 = this.Position;
      let zero = float3.Zero;
      let local2 = zero;
      if (float3.Equals(local1,local2))
      {
        let local3 = this.Rotation;
        let identity = floatQ.Identity;
        let local4 = identity;
        if (floatQ.Equals(local3, local4))
        {
          let local5 = this.Scale;
          let one = float3.One;
          let local6 = one;
          if (float3.Equals(local5,local6))
            return;
        }
      }
      for (let index = 0; index < this.AllVertices.Count; index++)
      {
        let allVertex = this.AllVertices.THIS_GET(index);
        let float3_1 = allVertex.Position;
        float3_1 = float3.Multiply(float3_1, this.Scale);
        float3_1 = floatQ.Multiply(this.Rotation,float3_1);
        allVertex.Position = float3.Add(float3_1, this.Position);
        if (normalsAndTangents)
        {
          if (this.Mesh.HasNormals)
          {
            allVertex.Normal = floatQ.Multiply(this.Rotation, allVertex.Normal);
          }
          if (this.Mesh.HasTangents)
          {
            let tangent4 = allVertex.Tangent4
            let xyz = floatQ.Multiply(this.Rotation,new float3(tangent4.x,tangent4.y,tangent4.z));
            allVertex.Tangent4 = new float4(xyz, tangent4.w);
          }
        }
      }
    }
}