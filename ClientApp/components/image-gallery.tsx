import * as React from 'react';
import { Grid, Row, Col, Image } from "react-bootstrap";
import { ImageContainer } from './image-container';

export interface ImageGalleryProps {
    images: File[];
    prediction: any[];
}

export class ImageGallery extends React.Component<ImageGalleryProps> {
    public render(): JSX.Element | null {
        if (this.props.images === null) {
            return null;
        }
        const rows: JSX.Element[] = [];
        for (let i = 0; i < this.props.images.length / 4; ++i) {
            const row: JSX.Element[] = [];
            for (let j = i * 4; j < i * 4 + 4 && j < this.props.images.length; ++j) {
                row.push(
                    <ImageContainer
                        image={this.props.images[j]}
                        prediction={this.props.prediction}
                    />
                );
            }
            rows.push(
                <Row>
                    {row}
                </Row>
            );
        }
        return (
            <Grid>
                {rows}
            </Grid>
        );
    }
}
