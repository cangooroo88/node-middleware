import * as AWS from 'aws-sdk';

export interface AWSImage {
    content: string; //base 64 content
}

export interface AWSFace {
    BoundingBox: {
        Height: number;
        Left: number;
        Top: number;
        Width: number;
    };
    Confidence: number;
}

export interface AWSFaceMatches {
    FaceMatches: {
       Face: AWSFace 
       Similarity: number;
    }[];
    SourceImageFace: AWSFace;
}

export interface AWSTextDetection {
    DetectedText: string;
    Type: 'LINE' | 'WORD';
    Id: number;
    ParentId?: number;
    Confidence: number;
    Geometry: {
        BoundingBox: {
            Width: number;
            Height: number;
            Left: number;
            Top: number;
        },
        Polygon: {X: number, Y: number}[];
    }
}

export interface AWSFaceDetails {
    FaceDetails: AWSFaceDetail[];
    OrientationCorrection: 'ROTATE_0' | 'ROTATE_90' | 'ROTATE_180' | 'ROTATE_270';
}

export interface AWSFaceDetail {
    AgeRange: { 
        High: number,
        Low: number
    },
    Beard: { 
        Confidence: number,
        Value: boolean
    },
    BoundingBox: { 
        Height: number,
        Left: number,
        Top: number,
        Width: number
    },
    Confidence: number,
    Emotions: [ 
        { 
            Confidence: number,
            Type: string
        }
    ],
    Eyeglasses: { 
        Confidence: number,
        Value: boolean
    },
    EyesOpen: { 
        Confidence: number,
        Value: boolean
    },
    Gender: { 
        Confidence: number,
        Value: string
    },
    Landmarks: [ 
        { 
            Type: string,
            X: number,
            Y: number
        }
    ],
    MouthOpen: { 
        Confidence: number,
        Value: boolean
    },
    Mustache: { 
        Confidence: number,
        Value: boolean
    },
    Pose: { 
        Pitch: number,
        Roll: number,
        Yaw: number
    },
    Quality: { 
        Brightness: number,
        Sharpness: number
    },
    Smile: { 
        Confidence: number,
        Value: boolean
    },
    Sunglasses: { 
        Confidence: number,
        Value: boolean
    }
}

export interface AWSConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}

/**
 * Amazon rekognition service
 */
export class AWSRekognitionService {
    protected rekognitionApi;

    constructor(protected config: AWSConfig) {
        AWS.config.update({
            region: config.region,
            credentials: new AWS.Credentials(config.accessKeyId, config.secretAccessKey)
        });

        this.rekognitionApi = new AWS.Rekognition();
    }

    /**
     * Compares the largest face detected in the source image with each face detected in the target image.
     *
     * @param source 
     * @param target 
     * @param similarityThreshold 
     */
    public compareFaces(source: Buffer, target: Buffer, similarityThreshold: number = 0.5): Promise<AWSFaceMatches> {
        const params = {
            SourceImage: {
                Bytes: source
            },
            TargetImage: {
                Bytes: target
            },
            SimilarityThreshold: similarityThreshold
        };

        return new Promise((resolve: (value: AWSFaceMatches) => void, reject: (reason: any) => void) => {
            this.rekognitionApi.compareFaces(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data as AWSFaceMatches);
            });
        });
    }

    /**
     * Detech faces from image
     *
     * @param source source image
     */
    public detectFaces(source: Buffer): Promise<AWSFaceDetails> {
        const params = {
            Attributes: ['ALL'],
            Image: {
                Bytes: source
            }
        };

        return new Promise((resolve: (value: AWSFaceDetails) => void, reject: (reason: any) => void) => {
            this.rekognitionApi.detectFaces(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    /**
     * Detects text in the input image and converts it into machine-readable text.
     *
     * @param source 
     */
    public detectText(source: Buffer): Promise<AWSTextDetection[]> {
        const params = {
            SourceImage: {
                Bytes: source
            }
        };

        return new Promise((resolve: (value: AWSTextDetection[]) => void, reject: (reason: any) => void) => {
            this.rekognitionApi.detectText(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}