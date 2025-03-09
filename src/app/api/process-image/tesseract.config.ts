import { TesseractConfig } from 'tesseract.js';

export const config: TesseractConfig = {
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  logger: (info: any) => {
    console.log(info);
  },
  errorHandler: (error: any) => {
    console.error('Tesseract Error:', error);
  }
}; 