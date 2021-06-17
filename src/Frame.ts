import { MeshXShape } from './MeshXShape';
import { float2 } from './float2';
import { TriangleSubmesh } from './TriangleSubmesh';
import { float3 } from './float3';
import { float4 } from './float4';
export class Frame extends MeshXShape {
  public ContentSize: float2 = float2.One
  public Thickness: number = 0.1
  public UVScale: float2 = float2.One

  constructor(submesh: TriangleSubmesh) {
    super(submesh.Mesh)
    this.Mesh.AddVertices(8, this.AllVertices);
    let indexUnsafe = this.AllVertices.THIS_GET(0).IndexUnsafe;
    for (let index = 0; index < 4; index++) {
      let num = index * 2;
      let quadTriangles = this.Mesh.AddQuadAsTriangles((indexUnsafe + num) % 8, (indexUnsafe + 2 + num) % 8, (indexUnsafe + 3 + num) % 8, (indexUnsafe + 1 + num) % 8);
      this.AllTriangles.Add(quadTriangles.first);
      this.AllTriangles.Add(quadTriangles.second);
    }
  }
  /**@override */
  public Update(): void {
    this.Mesh.HasNormals = true;
    this.Mesh.HasTangents = true;
    this.Mesh.HasUV0s = true;
    let float2_1 = float2.Multiply(this.ContentSize, 0.5)
    let indexUnsafe = this.AllVertices.THIS_GET(0).IndexUnsafe;
    let local1 = this.ContentSize;
    let float2_2 = float2.Add(this.ContentSize, this.Thickness);
    let local2 = float2_2;
    let float2_3 = float2.Divide(local1, local2);
    for (let index1 = 0; index1 < 4; index1++) {
      let num1 = index1 == 0 || index1 == 3 ? -1 : 1;
      let num2 = index1 == 2 || index1 == 3 ? -1 : 1;
      let index2 = indexUnsafe + index1 * 2;
      let index3 = index2 + 1;
      this.Mesh.RawPositions[index2] = new float3((float2_1.x + this.Thickness) * num1, (float2_1.y + this.Thickness) * num2, 0);
      this.Mesh.RawPositions[index3] = new float3(float2_1.x * num1, float2_1.y * num2, 0);
      let float2_4 = new float2(num1, num2);
      let float2_5 = float2.Multiply(float2_4, float2_3);
      let float2_6 = float2.Multiply(float2_4, 0.5);
      float2_4 = float2.Add(float2_6, 0.5);
      let float2_7 = float2.Multiply(float2_5, 0.5);
      float2_5 = float2.Add(float2_7, 0.5);
      float2_4 = new float2(float2_4.x, 1 - float2_4.y);
      float2_5 = new float2(float2_5.x, 1 - float2_5.y);
      this.Mesh.RawUV0s[index2] = float2.Multiply(float2_4, this.UVScale);
      this.Mesh.RawUV0s[index3] = float2.Multiply(float2_5, this.UVScale);
    }
    for (let index1 = 0; index1 < 8; index1++) {
      this.Mesh.RawNormals[indexUnsafe + index1] = float3.Backward;
      let rawTangents = this.Mesh.RawTangents;
      let index2 = indexUnsafe + index1;
      let xyz = float3.Right;
      rawTangents[index2] = new float4(xyz, -1)
    }
    this.TransformVertices(true);
  }
}