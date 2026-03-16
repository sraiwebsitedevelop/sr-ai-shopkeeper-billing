declare module "html2canvas" {
  interface Options {
    scale?: number;
    useCORS?: boolean;
    backgroundColor?: string;
    [key: string]: unknown;
  }
  function html2canvas(
    element: HTMLElement,
    options?: Options,
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module "jspdf" {
  interface jsPDFOptions {
    orientation?: "portrait" | "landscape";
    unit?: string;
    format?: string | number[];
    [key: string]: unknown;
  }
  class jsPDF {
    constructor(options?: jsPDFOptions);
    addImage(
      imageData: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ): void;
    save(filename: string): void;
  }
  export default jsPDF;
}
