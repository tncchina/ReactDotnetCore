import { ImageContainerState } from '../components/image-container';

export class Predictor {
    private callback: (data: ImageContainerState) => void;

    constructor(callback: (data: ImageContainerState) => void) {
        this.callback = callback;
    }

    public predict(blobUri: string): void {
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
            this.callback({
                prediction: json["Predictions"]
            });
        }).catch(err => console.log(err));
    }
}
