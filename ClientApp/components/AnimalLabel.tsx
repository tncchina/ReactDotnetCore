import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

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
        if (pictures == null)
            return;


        console.log(pictures);

        var payload = {
            id: "string",
            tag: "string",
            imageName: "string",
            fileFormat: "string",
            imageBlob: "string",
            uploadBlobSASUrl: "string",
            downloadBlobSASUrl: "string",
            notes: "string"
        };

        var data = new FormData();
        data.append("json", JSON.stringify(payload));

        fetch('http://localhost:55464/api/storage/Upload', {
            method: 'POST',
            mode: 'no-cors',
            headers: new Headers({
                'accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8'
            }),
            body: JSON.stringify(payload)
        }).then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log("Name: " + json['PhotoName']);
            console.log("PhotoUrl: " + json['PhotoUrl']);
            console.log("Prediction: " + json['Prediction']);
            this.setState({ url: json['PhotoUrl'], prediction: json['Prediction'] });
        }).catch(err => console.log(err));
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
