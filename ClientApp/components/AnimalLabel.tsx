import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as azureblob from '../resources/azurestoragejs-2.10.100/bundle/azure-storage.blob';
var storage = azureblob.createBlobService();
const blobService = storage.createBlobService();

// Use Javascript module in Typescript
// https://stackoverflow.com/questions/38224232/how-to-consume-npm-modules-from-typescript
const ImageUploader: any = require('react-images-upload');

interface CounterState {
    url: string;
    prediction: string;
}

export class AnimalLabel extends React.Component<RouteComponentProps<{}>, CounterState> {
    constructor(props: any) {
        super(props);
        this.state = { url: "", prediction: "" };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(pictures: FileList | null) {
        if (pictures == null || pictures.length==0)
            return;

        var picture = pictures[0];
        var nameformats = picture.name.split('.');
        if (nameformats.length <= 1) {
            console.log("Invalid file format, '.' expected.");
            return;
        }
        var uploadTestData = {
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
            // Comment this code since the return object does not match the schema
             console.log("Name: " + json['imageBlob']);
            console.log("PhotoUrl: " + json['uploadBlobSASUrl']);
            console.log(json);
            }).catch(err => console.log(err));

        const upload = () => {
            return new Promise((resolve: any, reject: any) => {
                blobService.createBlockBlobFromLocalFile('containerName', 'blobName', 'sourceFilePath', err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ message: `Upload of '${blobName}' complete` });
                    }
                });
            });
        };
    }

    render() {
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
}
