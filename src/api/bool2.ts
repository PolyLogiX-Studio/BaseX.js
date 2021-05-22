import { PrimitivesUtility } from "./PrimitivesUtility";
import type { Out } from "@bombitmanbomb/utils";
export class bool2 {
	public DIMENSIONS = 2;
	public BASE_TYPENAME = "System.Boolean";
	public flags!: number;

	public get Dimensions(): 2 {
		return 2;
	}
	public static get False(): bool2 {
		return new bool2();
	}
	public static get True(): bool2 {
		return new bool2(true, true);
	}
	public get x(): boolean {
		return (this.flags & 1) > 0;
	}
	public get y(): boolean {
		return (this.flags & 2) > 0;
	}
	public THIS(n: number): boolean {
		if (n == 0) return this.x;
		if (n == 1) return this.y;
		throw new Error("Invalid vector element index");
	}
	public SetComponent(value: boolean, index: number): bool2 {
		if (index == 0) return new bool2(value, this.y);
		if (index == 1) return new bool2(this.x, value);
		throw new Error("Invalid vector element index");
	}
	public GetBoxedElement(n: number): boolean {
		return this.THIS(n);
	}
	public get ElementType(): "boolean" {
		return "boolean";
	}
	constructor(x = false, y = false) {
		this.bool2(x, y);
	}
	public bool2(x: boolean, y: boolean): void;
	public bool2(flags: number): void;
	public bool2(xy: bool2): bool2;
	public bool2(x: boolean | number | bool2, y = false): boolean | void | bool2 {
		if (x instanceof bool2) {
			return new bool2(x.x, x.y);
		}
		if (typeof x === "number") {
			this.flags = x;
			return;
		}
		if (typeof x === "boolean") {
			this.flags = 0;
			this.flags |= x ? 1 : 0;
			this.flags |= y ? 2 : 0;
			return;
		}
	}
	public toString(): string {
		return `[${this.x};${this.y}]`;
	}
	public static Parse(s: string): bool2 {
		const elements = PrimitivesUtility.ExtractElements(s, 2) as [
			string,
			string
		];
		return new bool2(
			elements[0].toLowerCase() == "true",
			elements[1].toLowerCase() == "true"
		);
	}
	public static TryParse(s: string, val: Out<bool2>): boolean {
		const elements: string[] = PrimitivesUtility.ExtractElements(s, 2) as [
			string,
			string
		];
		if (elements.length != 2) {
			val.Out = new bool2();
			return false;
		}
		val.Out = new bool2(
			elements[0].toLowerCase() == "true",
			elements[1].toLowerCase() == "true"
		);
		return true;
	}
	public get Any(): boolean {
		return this.flags > 0;
	}
	public get All(): boolean {
		return this.flags == 3;
	}
	public get None(): boolean {
		return this.flags == 0;
	}
	public static NOT(v: bool2): bool2 {
		return new bool2(!v.x, !v.y);
	}
	public static AND(n: boolean, v: bool2): bool2;
	public static AND(v: bool2, n: boolean): bool2;
	public static AND(a: bool2, b: bool2): bool2;
	public static AND(a: bool2 | boolean, b?: bool2 | boolean): bool2 {
		if (!(a instanceof bool2) && b instanceof bool2) {
			return new bool2(a && b.x, a && b.y);
		}
		if (!(b instanceof bool2) && a instanceof bool2) {
			return new bool2(b && a.x, b && a.y);
		}
		if (a instanceof bool2 && b instanceof bool2) {
			return new bool2(a.x && b.x, a.y && b.y);
		}
		throw new Error("Invalid Input");
	}
	public static OR(n: boolean, v: bool2): bool2;
	public static OR(v: bool2, n: boolean): bool2;
	public static OR(a: bool2, b: bool2): bool2;
	public static OR(a: bool2 | boolean, b?: bool2 | boolean): bool2 {
		if (!(a instanceof bool2) && b instanceof bool2) {
			return new bool2(a || b.x, a || b.y);
		}
		if (!(b instanceof bool2) && a instanceof bool2) {
			return new bool2(b || a.x, b || a.y);
		}
		if (a instanceof bool2 && b instanceof bool2) {
			return new bool2(a.x || b.x, a.y || b.y);
		}
		throw new Error("Invalid Input");
	}
	public static XOR(n: boolean, v: bool2): bool2;
	public static XOR(v: bool2, n: boolean): bool2;
	public static XOR(a: bool2, b: bool2): bool2;
	public static XOR(a: bool2 | boolean, b?: bool2 | boolean): bool2 {
		if (!(a instanceof bool2) && b instanceof bool2) {
			return new bool2(a != b.x, a != b.y);
		}
		if (!(b instanceof bool2) && a instanceof bool2) {
			return new bool2(b != a.x, b != a.y);
		}
		if (a instanceof bool2 && b instanceof bool2) {
			return new bool2(a.x != b.x, a.y != b.y);
		}
		throw new Error("Invalid Input");
	}
	public Equals(other: bool2): boolean {
		return this.x == other.x && this.y == other.y;
	}
	public static Equals(n: boolean, v: bool2): bool2;
	public static Equals(v: bool2, n: boolean): bool2;
	public static Equals(a: bool2, b: bool2): bool2;
	public static Equals(a: bool2 | boolean, b?: bool2 | boolean): bool2 {
		if (!(a instanceof bool2) && b instanceof bool2) {
			return new bool2(a == b.x, a == b.y);
		}
		if (!(b instanceof bool2) && a instanceof bool2) {
			return new bool2(b == a.x, b == a.y);
		}
		if (a instanceof bool2 && b instanceof bool2) {
			return new bool2(a.x == b.x, a.y == b.y);
		}
		throw new Error("Invalid Input");
	}
}
