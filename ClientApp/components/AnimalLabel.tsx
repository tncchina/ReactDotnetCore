import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as azureblob from '../resources/azurestoragejs-2.10.100/bundle/azure-storage.blob';
import { IBlobInfo } from '../Common/iblob-info';

// Use Javascript module in Typescript
// https://stackoverflow.com/questions/38224232/how-to-consume-npm-modules-from-typescript
const ImageUploader: any = require('react-images-upload');

interface CounterState {
    imageUrl: string;
    prediction: any[];
}

export class AnimalLabel extends React.Component<RouteComponentProps<{}>, CounterState> {
    private blobInfo: IBlobInfo;

    constructor(props: any) {
        super(props);
        this.state = { imageUrl: "", prediction: [] };
        this.handleChange = this.handleChange.bind(this);
        this.blobInfo = {
            blobUri: "",
            blobName: "",
            containerName: "",
            sasToken: "",
            fileName: "",
            hostUri: ""
        };
    }

    handleChange(pictures: FileList | null): void {
        if (pictures == null || pictures.length == 0)
            return;

        const picture: File = pictures[0];
        const nameformats: string[] = picture.name.split('.');
        if (nameformats.length <= 1) {
            console.log("Invalid file format, '.' expected.");
            return;
        }
        const uploadTestData = {
            imageName: picture.name
        };

        fetch('http://tncapi.azurewebsites.net/api/storage/Upload2', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: new Headers({
                'accept': 'text/plain',
                'Content-Type': 'application/json-patch+json'
            }),
            body: JSON.stringify(uploadTestData)
        }).then((response) => {
            return response.json();
        }).then((json) => {
            this.blobInfo = this.getBlobInfo(json['uploadBlobSASUrl']);
            this.uploadImageToBlob(this.blobInfo, picture);
        }).catch(err => console.log(err));

        this.setState({
            imageUrl: URL.createObjectURL(picture),
            prediction: []
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <header className="App-header">
                    <img
                        src={this.state.imageUrl.length == 0 ? '/images/chinariver.jpg' : this.state.imageUrl}
                        alt="animal image or placeholder"
                    />
                    {this.renderDescriptionMessage()}
                </header>
                <br />
                {
                    <input type="file" onChange={(e) => this.handleChange(e.target.files)} />
                }
                <br />
                <figure>
                    <figcaption> {this.renderPrediction()} </figcaption>
                </figure>
            </div>
        );
    }

    private getBlobInfo(blobInfoUrl: string): IBlobInfo {
        //Remove https:// prefix
        const url: string = blobInfoUrl.substring(8);
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

    public uploadImageToBlob(blobInfo: IBlobInfo, picture: File): void {
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
        fetch('http://tncapi.azurewebsites.net/api/prediction/cntk', {
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
            this.setState({
                prediction: json["Predictions"]
            });
        }).catch(err => console.log(err));
    }

    private convertExponentialToPercentage(num: string): string {
        return Number(num).toFixed(5);
    }

    private renderPrediction(): JSX.Element {
        const predictionResults = this.state.prediction.map((result, index) =>
            <li key={index}>
                <span className="animal-name-tag">{result["Tag"]}:</span>
                <span>{this.convertExponentialToPercentage(result["Probability"])}</span>
            </li>
        );

        return (
            <ul>{predictionResults}</ul>
        );
    }

    private renderDescriptionMessage(): JSX.Element {
        let message: string = "";
        if (this.state.imageUrl.length == 0) {
            message = "Upload a photo to see the prediction";
        } else {
            if (this.state.prediction.length == 0) {
                message = "Wait for your prediction result......";
            } else {
                message = "Here are the prediction results and you can upload another photo."
            }
        }
        return <h1>{message}</h1>
    }
}
