/**
 * 
 * Google cloud vision api dao
 * 
 * You must create instance of this class with credentials.
 */
import * as vision from '@google-cloud/vision';

export interface GoogleCloudVisionConfig {
    keyFilename: string;
}

/**
 * Service for detecting text
 */
export class GoogleCloudVisionService {
    protected gcloud: any;
    protected client: vision.ImageAnnotatorClient;

    constructor(protected config: GoogleCloudVisionConfig) {
        // Creates a client
        this.client = new vision.ImageAnnotatorClient({
            keyFilename: this.config.keyFilename
        });
    }

    /**
     * Detect text in image
     * 
     * @param image buffer with image data
     */
    public detectText(image: Buffer) {
        // TODO this is only example
        this.client.textDetection('./resources/wakeupcat.jpg')
            .then(results => {
                const labels = results[0].labelAnnotations;
                console.log('Labels:');
                labels.forEach(label => console.log(label.description));
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }
}