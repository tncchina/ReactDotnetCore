import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Reports extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Reports</h1>
            <p>By Category</p>
            <p>By Distribution</p>
            <img src="/images/goldenMonkey.PNG" alt="sample React image" />
        </div>;
    }
}
