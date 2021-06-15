import { IMeshXElement } from './IMeshXElement';
import { IMeshXPrimitive } from './IMeshXPrimitive';
import { TriangleSubmesh } from './TriangleSubmesh';
import { MeshX } from './MeshX';
export class Triangle implements IMeshXElement, IMeshXPrimitive {
  private index: number
  private version: number
  private submesh: TriangleSubmesh
  public get Submesh(): TriangleSubmesh {
    return this.submesh
  }
  public get Mesh(): MeshX {
    return this.submesh?.Mesh
  }
  public get IsNull(): boolean {
    return this.submesh == null
  }
  constructor(index: number, submesh: TriangleSubmesh) {
    this.index = index
    this.submesh = submesh
    if (submesh.Mesh.TrackRemovals)
      this.version = submesh.primitiveIDs[index];
    else
      this.version = submesh.PrimitivesVersion;
  }
  public Copy(t: Triangle): void {
    if (t.submesh == this.submesh) {
      this.Vertex0Index = t.Vertex0Index;
      this.Vertex1Index = t.Vertex1Index;
      this.Vertex2Index = t.Vertex2Index;
    }
    else {
      this.Vertex0 = this.Mesh.AddVertex(t.Vertex0);
      this.Vertex1 = this.Mesh.AddVertex(t.Vertex1);
      this.Vertex2 = this.Mesh.AddVertex(t.Vertex2);
    }
  }
  public get IndexUnsafe(): number {
    return this.index
  }
  public get Index(): number {
    this.UpdateIndex()
    return this.index
  }
  public get SubmeshIndexUnsafe(): number {
    return this.submesh.Index
  }
  public get SubmeshIndex(): number {
    this.UpdateIndex()
    return this.submesh.Index
  }
  public set SubmeshIndex(value: number) {
    this.UpdateIndex()
    let submesh = this.Mesh.TryGetSubmesh<TriangleSubmesh>(value)
    let index = this.index * 3;
    submesh.AddTriangle(this.submesh.indicies[index], this.submesh.indicies[index + 1], this.submesh.indicies[index + 2]);
    this.submesh.Remove(this.index);
  }
  public get Vertex0IndexUnsafe():number{
    return this.submesh.indicies[this.index * 3];
  }
  public set Vertex0IndexUnsafe(value:number){
    this.submesh.indicies[this.index * 3] = value
  }
  public get Vertex1IndexUnsafe():number{
    return this.submesh.indicies[this.index * 3 + 1];
  }
  public set Vertex1IndexUnsafe(value:number){
    this.submesh.indicies[this.index * 3 + 1] = value
  }
  public get Vertex2IndexUnsafe():number{
    return this.submesh.indicies[this.index * 3 + 2];
  }
  public set Vertex2IndexUnsafe(value:number){
    this.submesh.indicies[this.index * 3 + 2] = value
  }
}
