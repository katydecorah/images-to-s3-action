declare module "@mapbox/appropriate-images" {
  export function generate(
    config: Record<string, unknown>,
    options: { inputDirectory: string; outputDirectory: string },
  ): Promise<string[]>;
}
