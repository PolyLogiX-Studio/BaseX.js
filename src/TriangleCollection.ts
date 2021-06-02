import { List } from "@bombitmanbomb/utils";
import { Triangle } from "./Triangle";
export class TriangleCollection {
	public _triangles!: List<Triangle>;
	public get Count(): number {
		return this._triangles.Count;
	}
	//TODO Capacity
	public get IsReadOnly(): false {
		return false;
	}

	public THIS_GET(index: number): Triangle {
		const triangle = this._triangles[index];
		if (triangle.UpdateIndex()) this._triangles[index] = triangle;
		return triangle;
	}
	public THIS_SET(index: number, value: Triangle): void {
		this._triangles[index] = value;
	}
	constructor(capacity = 4) {
		this.TriangleCollection(capacity);
	}

	public TriangleCollection(capacity = 4): void {
		this._triangles = new List();
	}

	public Add(v: Triangle): void {
		this._triangles.Add(v);
	}

	public AddRange(collection: Array<Triangle> | List<Triangle>): void {
		this._triangles.AddRange(
			collection instanceof List ? collection : List.ToList(collection)
		);
	}

	public Remove(v: Triangle) {
		this._triangles.Remove(v);
	}

	public RemoveAt(index) {
		this._triangles.RemoveAt(index);
	}

	public RemoveRange(index, count) {
		this._triangles.RemoveRange(index, count);
	}

	public GetEnumerator() {
		this._triangles.GetEnumerator();
	}

	public IndexOf(item) {
		this._triangles.IndexOf(item);
	}

	public Insert(index, item) {
		this._triangles.Insert(index, item);
	}

	public Clear() {
		this._triangles.Clear();
	}

	public Contains(item) {
		this._triangles.Contains(item);
	}

	public CopyTo(array, arrayIndex) {
		this._triangles.CopyTo(array, arrayIndex);
	}

	public Clean() {
		this.Clear();
	}
}
