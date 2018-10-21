import * as React from 'react';
import { Col, Image } from "react-bootstrap";
import { Predictor } from '../Common/predictor';
import { ImageUploader } from '../Common/image-uploader';

export interface ImageContainerProps {
    image: File;
}

export interface ImageContainerState {
    prediction: any[];
}

export class ImageContainer extends React.Component<ImageContainerProps, ImageContainerState> {
    public render(): JSX.Element {
        if (this.state.prediction) {
            return <p>Prediction is ready</p>
        } else {
            return (
                <Col xs={6} md={3}>
                    <Image src={URL.createObjectURL(this.props.image)} thumbnail />
                    <p>Waiting for prediction</p>
                </Col>
            );
        }
    }

    public componentDidMount() {
        const uploader: ImageUploader = new ImageUploader(new Predictor((newState: ImageContainerState) => {
            this.setState(newState);
        }));
    }
}
