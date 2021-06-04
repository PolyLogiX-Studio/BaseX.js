import { IMeshXElement } from './IMeshXElement';
import { IMeshXPrimitive } from './IMeshXPrimitive';
import { PointSubmesh } from './PointSubmesh';


export class Point implements IMeshXElement, IMeshXPrimitive {
  private index:number
  private version:number
  private submesh:PointSubmesh
  public get Submesh():PointSubmesh{
    return this.Submesh
  }


  public get Index():number{
    this.UpdateIndex()
    return this.index
  }
}