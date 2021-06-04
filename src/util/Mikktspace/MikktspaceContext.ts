import type { VerticesPerFaceHandler } from "./VerticesPerFaceHandler";
import type { VetrexPositionHandler } from "./VetrexPositionHandler";
import type { VertexNormalHandler } from "./VertexNormalHandler";
import type { VertexUVHandler } from "./VertexUVHandler";
import type { BasicTangentHandler } from "./BasicTangentHandler";
import type { TangentHandler } from "./TangentHandler";
export class MikktspaceContext {
	public FaceCount: number;
	public readonly GetVerticesPerFace: VerticesPerFaceHandler;
	public readonly GetVertexPosition: VetrexPositionHandler;
	public readonly GetVertexNormal: VertexNormalHandler;
	public readonly GetVertexUV: VertexUVHandler;
	public readonly SetTangentBasic!: BasicTangentHandler | null;
	public readonly SetTangent!: TangentHandler | null;
	public get UsesBasicTangentHandler(): boolean {
		return this.SetTangentBasic != null;
	}

	constructor(
		faceCount: number,
		getVerticesPerFace: VerticesPerFaceHandler,
		getVertexPosition: VetrexPositionHandler,
		getVertexNormal: VertexNormalHandler,
		getVertexUV: VertexUVHandler,
		setTangentBasic: BasicTangentHandler | null = null,
		setTangent: TangentHandler | null = null
	) {
		if (faceCount <= 0) throw new EvalError("Face Count must be larger than 0");
		if (getVerticesPerFace == null)
			throw new EvalError("All mesh data callbacks must be provided");
		if (getVertexNormal == null)
			throw new EvalError("All mesh data callbacks must be provided");
		if (getVertexUV == null)
			throw new EvalError("All mesh data callbacks must be provided");
		if (setTangentBasic == null && setTangent == null)
			throw new EvalError("Both setTangentBasic and setTangent are null");
		if (setTangentBasic != null && setTangent != null)
			throw new EvalError(
				"setTangentBasic and setTangent cannot be used at the same time"
			);
		this.FaceCount = faceCount;
		this.GetVerticesPerFace = getVerticesPerFace;
		this.GetVertexPosition = getVertexPosition;
		this.GetVertexNormal = getVertexNormal;
		this.GetVertexUV = getVertexUV;
		this.SetTangentBasic = setTangentBasic;
		this.SetTangent = setTangent;
	}
}
