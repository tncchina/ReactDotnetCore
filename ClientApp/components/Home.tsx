import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <p></p>
            <p>TNC uses 160 infrared cameras to monitor the animals of the habitat of the Yunnan Golden Monkey(YGM) in three protected areas(Two nature reserves, one National Park) every day. With these photos, 2 people in each protected areas copied the photos into local file system. Today, each protected area needs additional 2 more peiple to review each photo and label whether there is animal there and what kind of animals.</p>
            <p>Using these labelling data, TNC can better understanding the wild animal species distribution, population size, behavior and habitat utilization and other important information, so as to protect the management of wild animals and resources to provide reference.</p>
            <p>Using AI techonology to help ease the tedious and huge amount of manual efforts.</p>
            <img src="/images/goldenMonkey.PNG" alt="sample React image" />
        </div>;
    }
}
