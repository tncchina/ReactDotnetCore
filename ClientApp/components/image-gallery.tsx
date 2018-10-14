import * as React from 'react';
import { Grid, Row, Col, Image } from "react-bootstrap";

export interface ImageGalleryProps {
    images: FileList | null;
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
                    <Col xs={6} md={3}>
                        <Image src={this.getImageUrl(this.props.images[j])} thumbnail />
                    </Col>
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

    private getImageUrl(img: File): string {
        return URL.createObjectURL(img);
    }
}
