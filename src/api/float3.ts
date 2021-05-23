import { Out } from "@bombitmanbomb/utils";
import { MathX } from "./MathX";
import { PrimitivesUtility } from "./PrimitivesUtility";
import { bool2 } from "./bool2";
import { float2 } from "./float2";
export class float3 {
	public DIMENSIONS = 3;
	public BASE_TYPENAME = "System.Single";
	public COMPONENT_RATIO = 0.3333333;
	public x!: number;
	public y!: number;
	public z!: number;
	public get Dimensions(): 3 {
		return 3;
	}
	public static get Zero(): float3 {
		return new float3();
	}
	public static get One(): float3 {
		return new float3(1, 1, 1);
	}
	public static get MinValue(): float3 {
		return new float3(-3.40282347e38, -3.40282347e38, -3.40282347e38);
	}
	public static get MaxValue(): float3 {
		return new float3(3.40282347e38, 3.40282347e38, 3.40282347e38);
	}
	public static get Forward(): float3 {
		return new float3(0, 0, 1);
	}
	public static get Backward(): float3 {
		return new float3(0, 0, -1);
	}
	public static get Up(): float3 {
		return new float3(0, 1, 0);
	}
	public static get Down(): float3 {
		return new float3(0, -1, 0);
	}
	public static get Left(): float3 {
		return new float3(1, 0, 0);
	}
	public static get Right(): float3 {
		return new float3(-1, 0, 0);
	}
	public get X(): number {
		return this.x;
	}
	public get Y(): number {
		return this.y;
	}
	public get Z(): number {
		return this.z;
	}
	public THIS(n: number): number {
		switch (n) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		}
		throw new Error("Invalid vector element index");
	}
	public SetComponent(value: number, index: number): float3 {
		switch (index) {
		case 0:
			return new float3(value, this.y, this.z);
		case 1:
			return new float3(this.x, value, this.z);
		case 2:
			return new float3(this.x, this.y, value);
		}
		throw new Error("Invalid vector element index");
	}
	public GetBoxedElement(n: number): number {
		return this.THIS(n);
	}
	public get ElementType(): "float" {
		return "float";
	}
	constructor(x = 0, y = 0, z = 0) {
		this.float3(x, y, z);
	}
	public toString(): string {
		return `[${this.x};${this.y};${this.z}]`;
	}
	public static Parse(s: string): float3 {
		const elements = PrimitivesUtility.ExtractElements(s, 3) as [
			string,
			string,
			string
		];
		return new float3(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2])
		);
	}
	public static TryParse(s: string, val: Out<float3>): boolean {
		const elements = PrimitivesUtility.ExtractElements(s, 3) as [
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new float3();
			return false;
		}
	}
	public GetHashCode(): number {
		return (((this.x * 397) ^ this.y) * 397) ^ this.z;
	}
	toJSON(): { x: number; y: number; z: number } {
		return { x: this.x, y: this.y, z: this.z };
	}
}
