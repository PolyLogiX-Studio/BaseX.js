import { List } from "@bombitmanbomb/utils";
import { Point } from "./Point";
export class PointCollection {
	/**@internal */
	public _points: List<Point>;

	public get Count(): number {
		return this._points.Count;
	}

	public get Capacity(): number {
		return this._points.Capacity;
	}

	public set Capacity(value: number) {
		this._points.Capacity = value;
	}

	public get IsReadOnly(): false {
		return false;
	}

	public THIS_GET(index: number): Point {
		const point = this._points[index];
		if (point.UpdateIndex()) this._points[index] = point;
		return point;
	}

	public THIS_SET(index: number, value: Point): void {
		this._points[index] = value;
	}

	public UpdateIndexes(): void {
		for (let index = 0; index < this._points.Count; index++) {
			const point: Point = this._points[index];
			point.UpdateIndex();
			this._points[index] = point;
		}
	}

	constructor(capacity = 4) {
		this._points = new List<Point>(capacity);
	}

	public Add(v: Point): void {
		this._points.Add(v);
	}
	public AddRange(collection: List<Point>): void {
		this._points.AddRange(collection);
	}

	public Remove(v: Point): boolean {
		return this._points.Remove(v) != null;
	}

	public RemoveAt(index: number): void {
		this._points.RemoveAt(index);
	}

	public RemoveRange(index: number, count: number): void {
		this._points.RemoveRange(index, count);
	}

	public IndexOf(item: Point): number {
		return this._points.indexOf(item);
	}

	public Insert(index: number, item: Point): void {
		this._points.Insert(index, item);
	}

	public Clear(): void {
		this._points.Clear();
	}

	public Contains(item: Point): boolean {
		return this._points.Contains(item);
	}

	public CopyTo(array: Point[], arrayIndex: number): void {
		this._points.CopyTo(array, arrayIndex);
	}
}
