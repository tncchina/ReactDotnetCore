import * as React from 'react';
import { Grid, Row, Col, Image } from "react-bootstrap";
import { ImageContainer } from './image-container';

export interface ImageGalleryProps {
    images: File[];
    prediction: any[];
    location: string;
}

export class ImageGallery extends React.Component<ImageGalleryProps> {
    public render(): JSX.Element | null {
        const rows: JSX.Element[] = [];
        for (let i = 0; i < this.props.images.length / 4; ++i) {
            const row: JSX.Element[] = [];
            for (let j = i * 4; j < i * 4 + 4 && j < this.props.images.length; ++j) {
                row.push(
                    <ImageContainer
                        key={`${this.props.images[j].name}-${i}`}
                        image={this.props.images[j]}
                        prediction={this.props.prediction}
                        index={i}
                        location={this.props.location}
                    />
                );
            }
            rows.push(
                <Row key={i}>
                    {row}
                </Row>
            );
        }
        return (
            <Grid>
                <h3>{this.props.location}</h3>
                {rows}
            </Grid>
        );
    }
}
