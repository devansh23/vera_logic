declare module 'get-image-colors' {
  function getColors(input: Buffer, type: string): Promise<Array<{ hex: () => string }>>;
  export = getColors;
}

declare module 'nearest-color' {
  interface ColorMap {
    [key: string]: string;
  }

  interface NearestColorResult {
    name: string;
    value: string;
    rgb: { r: number; g: number; b: number };
  }

  interface NearestColorFunction {
    (color: string): NearestColorResult;
  }

  interface NearestColor {
    from: (colors: ColorMap) => NearestColorFunction;
  }

  const nearestColor: NearestColor;
  export = nearestColor;
}

declare module 'colornames' {
  function colornames(name: string): string | undefined;
  export = colornames;
} 