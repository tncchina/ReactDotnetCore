import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div>
            <p>TNC uses one hundred sixty infrared cameras to monitor the animals of the habitat of the Yunnan Golden Monkey(YGM) in three protected areas(Two nature reserves, one National Park) every day. With these photos, two people in each protected areas copied the photos into a local file system. Today, each protected area needs an additional two more people to review each photo and label whether there is an animal there and what kind of animals.</p>
            <p>Using these labeling data, TNC can better understanding the wild animal species distribution, population size, behavior, and habitat utilization and other important information, so as to protect the management of wild animals and resources to provide a reference.</p>
            <p>Using AI technology to help ease the tedious and huge amount of manual efforts.</p>
            <img src="/images/monkeys.jpeg" alt="home page image" />
        </div>;
    }
}