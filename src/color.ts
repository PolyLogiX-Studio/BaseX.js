import { float2 } from "./float2";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { MathX } from "./MathX";
import { PrimitivesUtility } from "./PrimitivesUtility";
import { Out } from "@bombitmanbomb/utils";
import { bool4 } from "./bool4";
import { ColorHSV } from "./ColorHSV";
import { color32 } from "./color32";
export class color {
	public r!: number;
	public g!: number;
	public b!: number;
	public a!: number;
	public SetHue(hue: number): color {
		const hsv = new ColorHSV(this);
		hsv.h = hue;
		return hsv.ToRGB();
	}
	public SetSaturation(saturation: number): color {
		const hsv = new ColorHSV(this);
		hsv.s = saturation;
		return hsv.ToRGB();
	}
	public SetValue(value: number): color {
		const hsv = new ColorHSV(this);
		hsv.v = value;
		return hsv.ToRGB();
	}
	public MulHue(hue: number): color {
		const hsv = new ColorHSV(this);
		hsv.h *= hue;
		return hsv.ToRGB();
	}
	public MulSaturation(saturation: number): color {
		const hsv = new ColorHSV(this);
		hsv.s *= saturation;
		return hsv.ToRGB();
	}
	public MulValue(value: number): color {
		const hsv = new ColorHSV(this);
		hsv.v *= value;
		return hsv.ToRGB();
	}
	public static FromHexCode(
		hex: string,
		color: Out<color>,
		defaultAlpha?: number
	): boolean;
	public static FromHexCode(
		hex: string,
		color: Out<color>,
		hasAlpha: Out<boolean>,
		defaultAlpha?: number
	): boolean;
	public static FromHexCode(hex: string, failColor: color): color;
	public static FromHexCode(
		hex: string,
		failColor: color | Out<color> = new color(),
		hasAlpha: Out<boolean> | number | null = null,
		defaultAlpha = 1
	): color | boolean {
		if (failColor instanceof color) {
			const col: Out<color> = new Out();
			return this.FromHexCode(hex, col)
				? (col.Out as color)
				: (failColor as color);
		} else {
			if (hasAlpha == null) {
				const color1: Out<color32> = new Out();
				const num = color32.FromHexCode(hex, color1) ? 1 : 0;
				failColor.Out = color32.ToColor(color1.Out as color32);
				return num != 0;
			} else if (typeof hasAlpha != "number") {
				const color1: Out<color32> = new Out();
				const num = color32.FromHexCode(
					hex,
					color1,
					hasAlpha,
					MathX.Clamp(defaultAlpha * 255, 0, 255)
				)
					? 1
					: 0;
				failColor.Out = color32.ToColor(color1.Out as color32);
				return num != 0;
			} else {
				return color.FromHexCode(hex, failColor, new Out(), hasAlpha ?? 1);
			}
		}
	}
	public static AlphaBlend(src: color, dst: color): color {
		const num = MathX.Clamp01(src.a);
		return new color(
			float3.Add(
				float3.Multiply(new float3(src.r, src.g, src.b), num),
				float3.Multiply(new float3(dst.r, dst.g, dst.b), 1 - num)
			),
			Math.min(1, src.a + dst.a)
		);
	}
	public static AdditiveBlend(src: color, dst: color): color {
		return new color(
			float3.Add(
				new float3(src.r, src.g, src.b),
				new float3(dst.r, dst.g, dst.b)
			),
			Math.min(1, src.a + dst.a)
		);
	}
	public static SoftAdditiveBlend(src: color, dst: color): color {
		return new color(
			float3.Add(
				float3.Multiply(
					new float3(src.r, src.g, src.b),
					float3.Subtract(1, new float3(dst.r, dst.g, dst.b))
				),
				new float3(dst.r, dst.g, dst.b)
			),
			Math.min(1, src.a + dst.a)
		);
	}
	public static MultiplicativeBlend(src: color, dst: color): color {
		return color.Multiply(src, dst);
	}
	public THIS(index: number): number {
		switch (index) {
		case 0:
			return this.r;
		case 1:
			return this.g;
		case 2:
			return this.b;
		case 3:
			return this.a;
		default:
			throw new Error("Invalid color channel index!");
		}
	}
	constructor(
		r?: number | float2 | float3 | float4,
		g?: number | float2 | float3,
		b?: number | float2,
		a?: number
	) {
		this.color(r as number, g as number, b as number, a as number);
	}
	public color(greyscale: number, a: number): void;
	public color(r: number, g: number, b: number, a: number): void;
	public color(rg: float2, b: number, a: number): void;
	public color(r: number, gb: float2, a: number): void;
	public color(r: number, g: number, ba: float2): void;
	public color(rgb: float3, a: number): void;
	public color(r: number, gba: float3): void;
	public color(rgba: float4): void;
	public color(
		r?: number | float2 | float3 | float4,
		g?: number | float2 | float3,
		b?: number | float2,
		a?: number
	): void {
		if (
			typeof r === "number" &&
			typeof g === "number" &&
			typeof b === "number"
		) {
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a ?? 1;
		} else if (r instanceof float2 && typeof g === "number") {
			this.r = r.x;
			this.g = r.y;
			this.b = g;
			this.a = (b as number) ?? 1;
		} else if (typeof r === "number" && g instanceof float2) {
			this.r = r;
			this.g = g.x;
			this.b = g.y;
			this.a = (b as number) ?? 1;
		} else if (
			typeof r === "number" &&
			typeof g === "number" &&
			b instanceof float2
		) {
			this.r = r;
			this.g = g;
			this.b = b.x;
			this.a = b.y;
		} else if (r instanceof float3) {
			this.r = r.x;
			this.g = r.y;
			this.b = r.z;
			this.a = (g as number) ?? 1;
		} else if (typeof r === "number" && g instanceof float3) {
			this.r = r;
			this.g = g.x;
			this.b = g.y;
			this.a = g.z;
		} else if (r instanceof float4) {
			this.r = r.x;
			this.g = r.y;
			this.b = r.z;
			this.a = r.w;
		} else if (typeof r === "number" && b == null) {
			this.r = r;
			this.g = r;
			this.b = r;
			this.a = (g as number) ?? 1;
		} else throw new Error("Invalid Input!");
	}
	public static get Clear(): color {
		return new color(0, 0, 0, 0);
	}
	public static get White(): color {
		return new color(1);
	}
	public static get LightGray(): color {
		return new color(0.75);
	}
	public static get Gray(): color {
		return new color(0.5);
	}
	public static get DarkGray(): color {
		return new color(0.25);
	}
	public static get Black(): color {
		return new color(0);
	}
	public static get Red(): color {
		return new color(1, 0, 0);
	}
	public static get Green(): color {
		return new color(0, 1, 0);
	}
	public static get Blue(): color {
		return new color(0, 0, 1);
	}
	public static get Yellow(): color {
		return new color(1, 1, 0);
	}
	public static get Cyan(): color {
		return new color(0, 1, 1);
	}
	public static get Magenta(): color {
		return new color(1, 0, 1);
	}
	public static get Orange(): color {
		return new color(1, 0.5, 0);
	}
	public static get Purple(): color {
		return new color(0.5, 0, 1);
	}
	public static get Lime(): color {
		return new color(0.75, 1, 0);
	}
	public static get Pink(): color {
		return new color(1, 0, 0.5);
	}
	public static get Brown(): color {
		return new color(0.25, 0, 0);
	}
	public toString(): string {
		return `[${this.r};${this.g};${this.b};${this.a}]`;
	}
	public toHexString(alpha = false, prefix = "#"): string {
		return `${prefix}${Math.round(MathX.Clamp(this.r * 255, 0, 255))
			.toString(16)
			.padStart(2, "0")
			.toUpperCase()}${Math.round(MathX.Clamp(this.g * 255, 0, 255))
			.toString(16)
			.padStart(2, "0")
			.toUpperCase()}${Math.round(MathX.Clamp(this.b * 255, 0, 255))
			.toString(16)
			.padStart(2, "0")
			.toUpperCase()}${
			alpha
				? Math.round(MathX.Clamp(this.a * 255, 0, 255))
					.toString(16)
					.padStart(2, "0")
					.toUpperCase()
				: ""
		}`;
	}
	toShortHexString(alpha = false, prefix = "#"): string {
		return `${prefix}${Math.round(MathX.Clamp(this.r * 16, 0, 16))
			.toString(16)
			.padStart(1, "0")
			.toUpperCase()}${Math.round(MathX.Clamp(this.g * 16, 0, 16))
			.toString(16)
			.padStart(1, "0")
			.toUpperCase()}${Math.round(MathX.Clamp(this.b * 16, 0, 16))
			.toString(16)
			.padStart(1, "0")
			.toUpperCase()}${
			alpha
				? Math.round(MathX.Clamp(this.a * 16, 0, 16))
					.toString(16)
					.padStart(1, "0")
					.toUpperCase()
				: ""
		}`;
	}
	public static Parse(s: string): color {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		return new color(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2]),
			parseFloat(elements[3])
		);
	}
	public static TryParse(s: string, val: Out<color>): boolean {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new color();
			return false;
		}
		val.Out = new color(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2]),
			parseFloat(elements[3])
		);
		return true;
	}

	public static Add(a: color, b: color): color;
	public static Add(a: number, b: color): color;
	public static Add(a: color, b: number): color;
	public static Add(a: color | number, b: color | number): color {
		if (a instanceof color && b instanceof color) {
			return new color(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a);
		} else if (typeof a == "number" && b instanceof color) {
			return new color(a + b.r, a + b.g, a + b.b, a + b.a);
		} else if (a instanceof color && typeof b == "number") {
			return new color(a.r + b, a.g + b, a.b + b, a.a + b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Subtract(a: color, b: color): color;
	public static Subtract(a: number, b: color): color;
	public static Subtract(a: color, b: number): color;
	public static Subtract(a: color | number, b: color | number): color {
		if (a instanceof color && b instanceof color) {
			return new color(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a);
		} else if (typeof a == "number" && b instanceof color) {
			return new color(a - b.r, a - b.g, a - b.b, a - b.a);
		} else if (a instanceof color && typeof b == "number") {
			return new color(a.r - b, a.g - b, a.b - b, a.a - b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Multiply(a: color, b: color): color;
	public static Multiply(a: number, b: color): color;
	public static Multiply(a: color, b: number): color;
	public static Multiply(a: color | number, b: color | number): color {
		if (a instanceof color && b instanceof color) {
			return new color(a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a);
		} else if (typeof a == "number" && b instanceof color) {
			return new color(a * b.r, a * b.g, a * b.b, a * b.a);
		} else if (a instanceof color && typeof b == "number") {
			return new color(a.r * b, a.g * b, a.b * b, a.a * b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Divide(a: color, b: color): color;
	public static Divide(a: number, b: color): color;
	public static Divide(a: color, b: number): color;
	public static Divide(a: color | number, b: color | number): color {
		if (a instanceof color && b instanceof color) {
			return new color(a.r / b.r, a.g / b.g, a.b / b.b, a.a / b.a);
		} else if (typeof a == "number" && b instanceof color) {
			return new color(a / b.r, a / b.g, a / b.b, a / b.a);
		} else if (a instanceof color && typeof b == "number") {
			return new color(a.r / b, a.g / b, a.b / b, a.a / b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Modulo(a: color, b: color): color;
	public static Modulo(a: number, b: color): color;
	public static Modulo(a: color, b: number): color;
	public static Modulo(a: color | number, b: color | number): color {
		if (a instanceof color && b instanceof color) {
			return new color(a.r % b.r, a.g % b.g, a.b % b.b, a.a % b.a);
		} else if (typeof a == "number" && b instanceof color) {
			return new color(a % b.r, a % b.g, a % b.b, a % b.a);
		} else if (a instanceof color && typeof b == "number") {
			return new color(a.r % b, a.g % b, a.b % b, a.a % b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Equals(a: color, b: color): boolean {
		return a.r == b.r && a.g == b.g && a.b == b.b && a.a == b.a;
	}

	public Equals(other: color): boolean {
		return (
			this.r == other.r &&
			this.g == other.g &&
			this.b == other.b &&
			this.a == other.a
		);
	}
	public static EQUAL(a: color, b: number): bool4;
	public static EQUAL(a: color, b: color): bool4;
	public static EQUAL(a: number, b: color): bool4;
	public static EQUAL(a: color | number, b: color | number): bool4 {
		if (a instanceof color && b instanceof color) {
			return new bool4(a.r == b.r, a.g == b.g, a.b == b.b, a.a == b.a);
		}
		if (typeof a == "number" && b instanceof color) {
			return new bool4(b.r == a, b.g == a, b.b == a, b.a == a);
		}
		if (a instanceof color && typeof b == "number") {
			return new bool4(a.r == b, a.g == b, a.b == b, a.a == b);
		}
		throw new Error("Invalid Input");
	}
	public static NOTEQUAL(a: color, b: number): bool4;
	public static NOTEQUAL(a: number, b: color): bool4;
	public static NOTEQUAL(a: color | number, b: color | number): bool4 {
		if (a instanceof color && b instanceof color) {
			return new bool4(a.r != b.r, a.g != b.g, a.b != b.b, a.a != b.a);
		}
		if (a instanceof color && typeof b == "number")
			return new bool4(a.r != b, a.g != b, a.b != b, a.a != b);
		if (typeof a == "number" && b instanceof color)
			return new bool4(b.r != a, b.g != a, b.b != a, b.a != a);
		throw new Error("Invalid input");
	}
	public static GREATER(a: color, b: number): bool4;
	public static GREATER(a: color, b: color): bool4;
	public static GREATER(a: number, b: color): bool4;
	public static GREATER(a: color | number, b: color | number): bool4 {
		if (a instanceof color && b instanceof color) {
			return new bool4(a.r > b.r, a.g > b.g, a.b > b.b, a.a > b.a);
		}
		if (typeof a == "number" && b instanceof color) {
			return new bool4(a > b.r, a > b.g, a > b.b, a > b.a);
		}
		if (a instanceof color && typeof b == "number") {
			return new bool4(a.r > b, a.g > b, a.b > b, a.a > b);
		}
		throw new Error("Invalid Input");
	}
	public static LESS(a: color, b: number): bool4;
	public static LESS(a: color, b: color): bool4;
	public static LESS(a: number, b: color): bool4;
	public static LESS(a: color | number, b: color | number): bool4 {
		if (a instanceof color && b instanceof color) {
			return new bool4(a.r < b.r, a.g < b.g, a.b < b.b, a.a < b.a);
		}
		if (typeof a == "number" && b instanceof color) {
			return new bool4(a < b.r, a < b.g, a < b.b, a < b.a);
		}
		if (a instanceof color && typeof b == "number") {
			return new bool4(a.r < b, a.g < b, a.b < b, a.a < b);
		}
		throw new Error("Invalid Input");
	}
	public static GREATEREQUAL(a: color, b: number): bool4;
	public static GREATEREQUAL(a: color, b: color): bool4;
	public static GREATEREQUAL(a: number, b: color): bool4;
	public static GREATEREQUAL(a: color | number, b: color | number): bool4 {
		if (a instanceof color && b instanceof color) {
			return new bool4(a.r >= b.r, a.g >= b.g, a.b >= b.b, a.a >= b.a);
		}
		if (typeof a == "number" && b instanceof color) {
			return new bool4(a >= b.r, a >= b.g, a >= b.b, a >= b.a);
		}
		if (a instanceof color && typeof b == "number") {
			return new bool4(a.r >= b, a.g >= b, a.b >= b, a.a >= b);
		}
		throw new Error("Invalid Input");
	}
	public static LESSEQUAL(a: color, b: number): bool4;
	public static LESSEQUAL(a: color, b: color): bool4;
	public static LESSEQUAL(a: number, b: color): bool4;
	public static LESSEQUAL(a: color | number, b: color | number): bool4 {
		if (a instanceof color && b instanceof color) {
			return new bool4(a.r <= b.r, a.g <= b.g, a.b <= b.b, a.a <= b.a);
		}
		if (typeof a == "number" && b instanceof color) {
			return new bool4(a <= b.r, a <= b.g, a <= b.b, a <= b.a);
		}
		if (a instanceof color && typeof b == "number") {
			return new bool4(a.r <= b, a.g <= b, a.b <= b, a.a <= b);
		}
		throw new Error("Invalid Input");
	}
	public Mask(mask: bool4, masked: color = new color()): color {
		return new color(
			mask.x ? this.r : masked.r,
			mask.y ? this.g : masked.g,
			mask.z ? this.b : masked.b,
			mask.w ? this.a : masked.a
		);
	}
	public NormalizeHDR(gain: Out<number>): color {
		gain.Out = Math.max(this.r, this.g, this.b, 1);
		return new color(
			float3.Multiply(new float3(this.r, this.g, this.b), gain.Out),
			this.a
		);
	}
	public ConstructHDR(gain: number): color {
		return new color(
			float3.Multiply(new float3(this.r, this.g, this.b), gain),
			this.a
		);
	}
	public SetR(r: number): color {
		return new color(r, this.g, this.b, this.a);
	}
	public SetG(g: number): color {
		return new color(this.r, g, this.b, this.a);
	}
	public SetB(b: number): color {
		return new color(this.r, this.g, b, this.a);
	}
	public SetA(a: number): color {
		return new color(this.r, this.g, this.b, a);
	}
	public MultiplyR(r: number): color {
		return new color(this.r * r, this.g, this.b, this.a);
	}
	public MultiplyG(g: number): color {
		return new color(this.r, this.g * g, this.b, this.a);
	}
	public MultiplyB(b: number): color {
		return new color(this.r, this.g, this.b * b, this.a);
	}
	public MultiplyA(a: number): color {
		return new color(this.r, this.g, this.b, this.a * a);
	}
	public MultiplyRGB(m: number): color {
		return new color(this.r * m, this.g * m, this.b * m, this.a);
	}
}
