import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as azureblob from '../resources/azurestoragejs-2.10.100/bundle/azure-storage.blob';
import { IBlobInfo } from '../Common/iblob-info';

// Use Javascript module in Typescript
// https://stackoverflow.com/questions/38224232/how-to-consume-npm-modules-from-typescript
const ImageUploader: any = require('react-images-upload');

interface CounterState {
    url: string;
    prediction: string;
}

export class AnimalLabel extends React.Component<RouteComponentProps<{}>, CounterState> {
    private blobInfo: IBlobInfo;

    constructor(props: any) {
        super(props);
        this.state = { url: "", prediction: "" };
        this.handleChange = this.handleChange.bind(this);
        this.blobInfo= {
            blobUri: "",
            blobName: "",
            containerName: "",
            sasToken: "",
            fileName: ""
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
            'imageName': picture.name
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
            const blobInfo: IBlobInfo = this.getBlobInfo(json['uploadBlobSASUrl']);
            this.uploadImageToBlob(blobInfo, picture);
        }).catch(err => console.log(err));
    }

    public render(): JSX.Element {
        return <div>
            <header className="App-header">
                <img src='/images/chinariver.jpg' alt="logo" />
                <h1 className="App-title">Upload a photo to see the prediction.</h1>
            </header>
            <input type="file" onChange={(e) => this.handleChange(e.target.files)} />
            <figure>
                <figcaption> {this.state.prediction} </figcaption>
                <img src={this.state.url} alt='photoUrl' />
            </figure>
        </div>;
    }

    private getBlobInfo(blobInfoUrl: string): IBlobInfo {
        //Remove https:// prefix
        const url: string = blobInfoUrl.substring(8);
        const subStrs: string[] = url.split('/').join(',').split('?').join(',').split(',');
        console.log(subStrs);
        const blobInfo: IBlobInfo = {
            blobUri: `https://${subStrs[0]}`,
            blobName: subStrs[2],
            fileName: subStrs[3],
            containerName: subStrs[1],
            sasToken: `?${subStrs[4]}`
        };

        return blobInfo;
    }

    public uploadImageToBlob(blobInfo: IBlobInfo, picture: File): void {
        const blobService = azureblob.createBlobServiceWithSas(blobInfo.blobUri, blobInfo.sasToken);
        const file = picture;
        const blockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        const options = {
            blockSize: blockSize
        };

        const speedSummary = blobService.createBlockBlobFromBrowserFile(blobInfo.containerName, `${blobInfo.blobName}/${blobInfo.fileName}`, file, options, (uploadError: any, blobResponse: any, uploadResponse: any) => {
            if (uploadError) {
                alert('Upload filed, open browser console for more detailed info.');
                console.log(uploadError);
            } else {
                alert('Upload successfully!');
            }
        });

        // this part of the code can be used to create a progress bar for uploading
        speedSummary.on('progress', () => {
            const process = speedSummary.getCompletePercent();
            alert(JSON.stringify(process));
        });
    }
}
