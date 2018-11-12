import * as React from 'react';
import { Col, Image } from "react-bootstrap";
import { Predictor } from '../Common/predictor';
import { IBlobInfo } from '../Common/iblob-info';
import * as azureblob from '../resources/azurestoragejs-2.10.100/bundle/azure-storage.blob';

export interface ImageContainerProps {
    image: File;
    prediction: any[];
    index: number;
    location: string;
}

export interface ImageContainerState {
    prediction: any[];
    imageUrl?: string;
}

export class ImageContainer extends React.Component<ImageContainerProps, ImageContainerState> {
    private static predictionResultNum: number = 1;

    constructor(props: any) {
        super(props);
        this.state = {
            prediction: [],
        };
    }

    public render(): JSX.Element {
        if (this.props.prediction.length > 0) {
            return <p>Prediction is ready</p>
        } else {
            return (
                <Col xs={6} md={3}>
                    <canvas ref='canvas' className='hidden'></canvas>
                    <img ref='image' src={URL.createObjectURL(this.props.image)} className='hidden'/>
                    <Image src={this.state.imageUrl? this.state.imageUrl : URL.createObjectURL(this.props.image)} thumbnail />
                    <div>
                        {this.state.prediction.length ? this.renderPrediction() : `Waiting for prediction`}
                    </div>
                </Col>
            );
        }
    }

    public async componentDidMount() {
        const blob = await this.getBlob();
        const blobInfo = this.generateBlobInfo(blob.uploadBlobSASUrl);
        this.uploadImageToBlob(blobInfo, this.props.image);
    }

    private getBlob(): Promise<any> {
        return fetch('https://tncapi.azurewebsites.net/api/storage/Upload2', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: new Headers({
                'accept': 'text/plain',
                'Content-Type': 'application/json-patch+json'
            }),
            body: JSON.stringify({
                imageName: this.props.image.name,
                notes: this.props.location
            })
        }).then((response) => {
            return response.json();
        });
    }

    private generateBlobInfo(blobSasUrl: string) {
        const url: string = blobSasUrl.substring(8);
        const subStrs: string[] = url.split('/').join(',').split('?').join(',').split(',');
        const blobInfo: IBlobInfo = {
            hostUri: `https://${subStrs[0]}`,
            blobName: subStrs[2],
            fileName: subStrs[3],
            containerName: subStrs[1],
            sasToken: `?${subStrs[4]}`,
            blobUri: `https://${subStrs[0]}/${subStrs[1]}/${subStrs[2]}/${subStrs[3]}`
        };

        return blobInfo;
    }


    private renderPrediction(): JSX.Element {
        const predictionResults = this.state.prediction.sort((a: any, b: any) => {
            return parseFloat(a.Probability) < parseFloat(b.Probability) ? 1 : -1;
        }).slice(0, ImageContainer.predictionResultNum).map((result, index) =>
            <li key={index}>
                <span className="animal-name-tag">{result["Tag"]}:</span>
                <span>{this.convertExponentialToPercentage(result["Probability"])}</span>
            </li>
        );

        return (
            <ul>{predictionResults}</ul>
        );
    }

    private convertExponentialToPercentage(num: string): string {
        return (Number(num) * 100).toFixed(2) + "%";
    }

    private uploadImageToBlob(blobInfo: IBlobInfo, picture: File): void {
        const blobService = azureblob.createBlobServiceWithSas(blobInfo.hostUri, blobInfo.sasToken);
        const file = picture;
        const blockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        const options = {
            blockSize: blockSize
        };


        const speedSummary = blobService.createBlockBlobFromBrowserFile(blobInfo.containerName, `${blobInfo.blobName}/${blobInfo.fileName}`, file, options, (uploadError: any, blobResponse: any, uploadResponse: any) => {
            if (uploadError) {
                console.log(uploadError);
            } else {
                this.sendPredictionRequest(blobInfo.blobUri);
            }
        });

        // this part of the code can be used to create a progress bar for uploading (under development)
        speedSummary.on('progress', () => {
            const process = speedSummary.getCompletePercent();
        });
    }

    private sendPredictionRequest(blobUri: string): void {
        fetch('https://tncapi.azurewebsites.net/api/prediction/cntknet', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: new Headers({
                'accept': 'text/plain',
                'Content-Type': 'application/json-patch+json'
            }),
            body: JSON.stringify(blobUri)
        }).then((response) => {
            return response.json();
        }).then((json) => {
            if (!json["Predictions"]) {
                return;
            }
            // TODO: Needs to draw multiple bunding box.
            const { Region } = json['Predictions'][0];
            const canvas = this.refs.canvas as any;
            const img = this.refs.image as any;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            ctx.lineWidth = "50";
            ctx.strokeStyle= "red";
            ctx.rect(
                img.width * Region.Left,
                img.height * Region.Top,
                img.width * Region.Width,
                img.height * Region.Height,
            );
            ctx.stroke();
            this.setState({
                imageUrl: canvas.toDataURL(),
                prediction: json["Predictions"],
            });
        }).catch(err => console.log('[err]: ', err, blobUri));
    }
}
