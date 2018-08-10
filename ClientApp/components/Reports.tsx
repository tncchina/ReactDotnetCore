import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as d3 from 'd3';



export class Reports extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <h1>Reports</h1>
            <p>By Category</p>
            <p>By Distribution</p>
            <img src="/images/goldenMonkey.PNG" alt="sample React image" />
            <script src="https://d3js.org/d3-dsv.v1.min.js"></script>
            <script src="https://d3js.org/d3-fetch.v1.min.js"></script>
            <script>
            d3.csv("/csv/L-AZH17-XB28.csv").then(function(data) {
              console.log(data);
            });
            </script>
        </div>;
    }
}
