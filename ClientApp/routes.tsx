import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AnimalLabel } from './components/AnimalLabel';
import { Reports } from './components/Reports';
import { Contact } from './components/Contact';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/Reports' component={Reports } />
    <Route path='/AnimalLabel' component={AnimalLabel} />
    <Route path='/Contact' component={Contact} />
</Layout>;
