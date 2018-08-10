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
            sasToken: ""
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
            'imageName': nameformats[0],
            'fileFormat': nameformats[1]
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
            console.log("Name: " + json['imageBlob']);
            console.log("PhotoUrl: " + json['uploadBlobSASUrl']);
            //this.blobInfo.blobName = json["id"];
            const blobInfo: IBlobInfo = this.getBlobInfo(json['uploadBlobSASUrl']);
            //blobInfo.sasToken="?st=2018-08-04T23%3A42%3A47Z&se=2018-08-05T23%3A42%3A47Z&sp=rwdl&sv=2018-03-28&sr=b&sig=nfzBxRUe%2BUhNPMHNBXzP9B05S8V8tGPHoQ9Wybfp3iY%3D";
            console.log(blobInfo);
            this.uploadImageToBlob(blobInfo, picture);
            console.log(json);
        }).catch(err => console.log(err));
    }

    public render(): JSX.Element {
        return <div>
            <header className="App-header">
                <img src='/images/chinariver.jpg' alt="logo" />
                <h1 className="App-title">Upload longhan a pooto to see the prediction.</h1>
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
            containerName: subStrs[1],
            sasToken: `?${subStrs[4]}`
        };

        return blobInfo;
    }

    public uploadImageToBlob(blobInfo: IBlobInfo, picture: File): void {
        // the blob uri and sastoken should come from C# request, I hardcoded here for testing purpos
        var blobUri = blobInfo.blobUri; // https://tncstorage4test.blob.core.windows.net";
        var sastoken = blobInfo.sasToken;// "?st=2018-08-04T23%3A42%3A47Z&se=2018-08-05T23%3A42%3A47Z&sp=rwdl&sv=2018-03-28&sr=b&sig=nfzBxRUe%2BUhNPMHNBXzP9B05S8V8tGPHoQ9Wybfp3iY%3D";

        var blobService = azureblob.createBlobServiceWithSas(blobUri, sastoken);
        var file = picture;
        var blockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        var options = {
            blockSize: blockSize
        };
        console.log(file);
        // The upload process is async, you will need to adjust the code based on the front end design 
        var speedSummary = blobService.createBlockBlobFromBrowserFile(blobInfo.containerName, `${blobInfo.blobName}/${file.name}`, file, options, (uploadError: any, blobResponse: any, uploadResponse: any) => {
            if (uploadError) {
                alert('Upload filed, open browser console for more detailed info.');
                console.log(uploadError);
            } else {
                alert('Upload successfully!');
            }
        });

        /*
        var speedSummary = blobService.createBlockBlobFromBrowserFile(blobInfo.containerName, `0000000-000000-000000-000000/${file.name}`, file, options, (uploadError: any, blobResponse: any, uploadResponse: any) => {
            if (uploadError) {
                alert('Upload filed, open browser console for more detailed info.');
                console.log(uploadError);
            } else {
                alert('Upload successfully!');
            }
        });
        */

        // this part of the code can be used to create a progress bar for uploading
        speedSummary.on('progress', () => {
            var process = speedSummary.getCompletePercent();
            alert(JSON.stringify(process));
        });
    }
}
