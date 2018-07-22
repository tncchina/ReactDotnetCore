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

        var formData = new FormData();
        for(var name in pictures){
            formData.append(name, pictures[name]);
        }
        fetch('https://tnc-ai-web-api.azurewebsites.net/api/storage/photoUpload', {
            method: 'POST',
            headers: new Headers({
                'Access-Control-Allow-Origin': '*',
            }),
            body: formData
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
                <h1 className="App-title">Upload a pooto to see the prediction.</h1>
            </header>
            <input type="file" onChange={(e) => this.handleChange(e.target.files)} />
            <figure>
                <figcaption> {this.state.prediction} </figcaption>
                <img src={this.state.url} alt='photoUrl' />
            </figure>
        </div>;
    }
}
