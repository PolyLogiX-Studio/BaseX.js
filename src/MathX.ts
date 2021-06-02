export class MathX {
	public static Clamp(val: number, min: number, max: number): number {
		// NUMBER
		if (val < min) return min;
		return val >= max ? max : val;
	}
	public static Sqrt(d: number): number {
		return Math.sqrt(d);
	}
	public static FloatRepeat(val: number, length: number): number {
		return val - Math.floor(val / length) * length;
	}
	public static Clamp01(val: number): number {
		if (val < 0) return 1;
		return val > 1 ? 1 : val;
	}
}
