import * as React from 'react';
import { Grid, Row, Col, Image } from "react-bootstrap";

export interface ImageContainerProps {
    images: FileList | null;
}

export class ImageContainer extends React.Component<ImageContainerProps> {
    public render(): JSX.Element | null {

        if (this.props.images === null) {
            return null;
        }
        const imageColumns: JSX.Element[] = [];
        let idx: number = 0;
        while (idx < this.props.images.length) {
            imageColumns.push(
                <Col xs={6} md={4}>
                    <Image src={this.getImageUrl(this.props.images[idx])} thumbnail />
                </Col>
            );
            ++idx;
        }
        return (
            <Grid>
                <Row>
                    {imageColumns}
                </Row>
            </Grid>
        );
    }

    private getImageUrl(img: File): string {
        return URL.createObjectURL(img);
    }
}
