import * as React from 'react';
import { Grid, Row, Col, Image } from "react-bootstrap";

export interface ImageContainerProps {
    image: File;
}

interface ImageContainerState {
    prediction: any[];
}

export class ImageContainer extends React.Component<ImageContainerProps, ImageContainerState> {
    public render(): JSX.Element {
        return (
            <Col xs={6} md={3}>
                <Image src={this.getImageUrl(this.props.image)} thumbnail />
            </Col>
        );
    }

    private getImageUrl(img: File): string {
        return URL.createObjectURL(img);
    }
}
