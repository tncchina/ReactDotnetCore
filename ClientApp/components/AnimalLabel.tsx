import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import {ReactImageUploadComponent} from 'react-images-upload';

// Use Javascript module in Typescript
// https://stackoverflow.com/questions/38224232/how-to-consume-npm-modules-from-typescript
// const ImageUploader: any = require('react-images-upload');

interface CounterState {
    url: string;
    prediction: string;
    pictures: FileList | null;
}

export class AnimalLabel extends React.Component<RouteComponentProps<{}>, CounterState> {
    constructor(props: any) {
        super(props);
        this.state = { url: "", prediction: "", pictures: null };
        this.handleChange = this.handleChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    onDrop(picture: FileList) {
        this.setState({
            pictures: picture,
        });
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
                <h1 className="App-title">Welcome to TNC-AI</h1>
            </header>
            <input type="file" onChange={(e) => this.handleChange(e.target.files)} />
            <figure>
                <figcaption> {this.state.prediction} </figcaption>
                <img src={this.state.url} alt='photoUrl' />
            </figure>
            <ReactImageUploadComponent
                withIcon={true}
                buttonText='Choose images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
        </div>;
    }
}
