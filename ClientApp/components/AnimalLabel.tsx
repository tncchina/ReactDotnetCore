import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as azureblob from '../resources/azurestoragejs-2.10.100/bundle/azure-storage.blob';
import { IBlobInfo } from '../Common/iblob-info';
import { ImageGallery } from './image-gallery';

// Use Javascript module in Typescript
// https://stackoverflow.com/questions/38224232/how-to-consume-npm-modules-from-typescript
//const ImageUploader: any = require('react-images-upload');

interface CounterState {
    imageUrl: string[];
    prediction: any[];
    images: File[];
}

export class AnimalLabel extends React.Component<RouteComponentProps<{}>, CounterState> {
    private blobInfo: IBlobInfo;

    constructor(props: any) {
        super(props);
        this.state = {
            imageUrl: [],
            prediction: [],
            images: []
        };
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

        const images: File[] = [];
        for (var i = 0; i < pictures.length; ++i) {
            images.push(pictures[i]);
        }

        images.forEach((image: File, index: number) => {
            const nameformats: string[] = image.name.split('.');
            if (nameformats.length <= 1) {
                console.log("Invalid file format, '.' expected.");
                return;
            }
        });

        this.setState({
            imageUrl: images.map((image: File) => {
                return URL.createObjectURL(image);
            }),
            prediction: [],
            images: images
        });
    }

    public render(): JSX.Element {
        if (this.state.imageUrl.length > 0) {
            return (
                <ImageGallery
                    images={this.state.images}
                    prediction={this.state.prediction}
                />

            );
        }
        return (
            <div>
                <header className="App-header">
                    Please upload images to predicat
                </header>
                <br />
                {
                    <input type="file" multiple onChange={(e) => this.handleChange(e.target.files)} />
                }
                <br />
                <figure>
                    <figcaption> {this.renderPrediction()} </figcaption>
                </figure>
            </div>
        );
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

    // private renderDescriptionMessage(): JSX.Element {
    //     let message: string = "";
    //     if (this.state.imageUrl.length == 0) {
    //         message = "Upload a photo to see the prediction";
    //     } else {
    //         if (this.state.prediction.length == 0) {
    //             message = "Wait for your prediction result......";
    //         } else {
    //             message = "Here are the prediction results and you can upload another photo."
    //         }
    //     }
    //     return <h1>{message}</h1>
    // }
}
