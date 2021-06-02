import { color } from "./color";
import { Out } from "@bombitmanbomb/utils";
import { MathX } from "./MathX";
import { float3 } from "./float3";
export class ColorHSV {
	public h!: number;
	public s!: number;
	public v!: number;
	public a!: number;
	private SIXTY_R = 0.1666667;

	public static Hue(hue: number): color {
		return new ColorHSV(hue, 1, 1).ToRGB();
	}
	public static GetHue(rgb: color): number {
		return new ColorHSV(rgb).h;
	}
	public static GetSaturation(rgb: color): number {
		return new ColorHSV(rgb).s;
	}
	public static GetValue(rgb: color): number {
		return new ColorHSV(rgb).v;
	}
	constructor(h: number | color, s?: number, v?: number, a?: number) {
		this.ColorHSV(h, s, v, a);
	}
	public ColorHSV(h: number | color, s?: number, v?: number, a = 1): void {
		if (h instanceof color) {
			this.h = this.s = this.v = this.a = 0;
			this.FromRGB(h);
		} else {
			this.h = h;
			this.s = s as number;
			this.v = v as number;
			this.a = a as number;
		}
	}
	public FromRGB(cRGB: color): void {
		const gain: Out<number> = new Out();
		const col = cRGB.NormalizeHDR(gain);
		const num1 = Math.max(col.r, col.g, col.b);
		const num2 = Math.min(col.r, col.g, col.b);
		const num3 = num1 - num2;
		this.h =
			num3 != 0.0
				? num1 != col.r
					? num1 != col.g
						? ((col.r - col.g) / num3 + 4.0) / 6.0
						: ((col.b - col.r) / num3 + 2.0) / 6.0
					: MathX.FloatRepeat((col.g - col.b) / num3, 6) / 6
				: 0.0;
		this.s = num1 != 0.0 ? num3 / num1 : 0.0;
		this.v = num1 * (gain.Out as number);
		this.a = col.a;
	}
	public ToRGB(): color {
		const gain = Math.max(this.v, 1);
		this.v /= gain;
		const num1 = this.v * this.s;
		const num2 = num1 * (1 - Math.abs(MathX.FloatRepeat(this.h * 6, 2) - 1));
		const num3 = this.v - num1;
		let col: color;
		switch (Math.floor(MathX.FloatRepeat(this.h, 1) / 0.16666667163372)) {
		case 0:
			col = new color(num1, num2, 0.0);
			break;
		case 1:
			col = new color(num2, num1, 0.0);
			break;
		case 2:
			col = new color(0.0, num1, num2);
			break;
		case 3:
			col = new color(0.0, num2, num1);
			break;
		case 4:
			col = new color(num2, 0.0, num1);
			break;
		case 5:
			col = new color(num1, 0.0, num2);
			break;
		default:
			col = new color(0.0, 0.0, 0.0);
			break;
		}
		return new color(
			float3.Add(new float3(col.r, col.b, col.b), num3),
			this.a
		).ConstructHDR(gain);
	}
}
