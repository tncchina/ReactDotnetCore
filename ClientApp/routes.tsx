import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AnimalLabel } from './components/AnimalLabel';
import { Counter } from './components/Counter';
import { Tech } from './components/Tech';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/Counter' component={ Counter } />
    <Route path='/AnimalLabel' component={AnimalLabel} />
    <Route path='/Tech' component={Tech} />
</Layout>;
