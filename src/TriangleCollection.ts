import { List, Enumerator } from "@bombitmanbomb/utils";
import { Triangle } from "./Triangle";
export class TriangleCollection {
	public [Symbol.iterator]() {
		return this._triangles[Symbol.iterator]()
	}
	public _triangles!: List<Triangle>;
	public get Count(): number {
		return this._triangles.Count;
	}
	public get Capacity(): number {
		return this._triangles.Capacity;
	}
	public set Capacity(value: number) {
		this._triangles.Capacity = value;
	}
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
		this._triangles = new List(capacity);
	}

	public Add(v: Triangle): void {
		this._triangles.Add(v);
	}

	public AddRange(collection: Array<Triangle> | List<Triangle>): void {
		this._triangles.AddRange(
			collection instanceof List ? collection : List.ToList(collection)
		);
	}

	public Remove(v: Triangle): void {
		this._triangles.Remove(v);
	}

	public RemoveAt(index: number): void {
		this._triangles.RemoveAt(index);
	}

	public RemoveRange(index: number, count: number): void {
		this._triangles.RemoveRange(index, count);
	}

	public GetEnumerator(): Enumerator<List<Triangle>> {
		return this._triangles.GetEnumerator();
	}

	public IndexOf(item: Triangle): void {
		this._triangles.indexOf(item);
	}

	public Insert(index: number, item: Triangle): void {
		this._triangles.Insert(index, item);
	}

	public Clear(): void {
		this._triangles.Clear();
	}

	public Contains(item: Triangle): boolean {
		return this._triangles.Contains(item);
	}

	public CopyTo(array: List<Triangle>, arrayIndex: number): void {
		this._triangles.CopyTo(array, arrayIndex);
	}

	public Clean(): void {
		this.Clear();
	}
}
