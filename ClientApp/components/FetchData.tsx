import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
const logo = require('./logo.svg') as string;

// Use Javascript module in Typescript
// https://stackoverflow.com/questions/38224232/how-to-consume-npm-modules-from-typescript
const ImageUploader: any = require('react-images-upload');

export class FetchData extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props: any) {
        super(props);
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
        fetch('http://localhost:49492/api/storage/photoUpload', {
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
            <input type="file" onChange={(e) => this.handleChange(e.target.files)} />
        </div>;
    }
}
