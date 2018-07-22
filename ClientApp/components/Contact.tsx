import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Contact extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Contact Us</h1>
            <p>Engineering support: <a href='xx@xxx.com'>@xxx.com</a> </p>
        </div>;
    }
}
