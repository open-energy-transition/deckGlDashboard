import { _RenderParameters } from "@deck.gl/core/typed";

interface DepthTestParameters {
  depthTest: boolean;
}

export interface DeckGLParameters
  extends _RenderParameters,
    DepthTestParameters {}
