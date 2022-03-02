/**
 * 
 * PDFService
 * 
 * You must create instance of this class
 */

const pdf = require('html-pdf');

export interface PDFServiceConfig {
}

/**
 * Service for generating PDFs
 */
export class PDFService {

    /**
     * Creates PDFService
     * 
     * @param config config
     */
    constructor(protected config: PDFServiceConfig) {}

    /**
     * convertHtmlToPDFBase64 
     * 
     * @param html html of content
     */
    public convertHtmlToPDFBase64(html: string): Promise<string> {
        let config = {
            "format": "A4",
            "border": "0.8cm",
            "phantomPath": "./node_modules/phantomjs-prebuilt/bin/phantomjs"
        }

        return new Promise((resolve, reject) => {
            let htmlHeader = `<html><head>
                <style>
                    table { display:block ! important; page-break-inside:avoid ! important; }
                </style>
            </head>
            <body>`;
            let htmlFooter = `</body></html>`;
            pdf.create(htmlHeader + html + htmlFooter, config)
                .toBuffer(function(err, buffer){
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(buffer.toString('base64'));
                });
        });
    }

}