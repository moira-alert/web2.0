// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import Layout from '../Components/Layout/Layout';

function SpaceFiller(props: { width?: number | string; height?: number | string; label?: string }): React.Element<*> {
    return (
        <div
            style={{
                height: props.height || 300,
                width: props.width || '100%',
                border: '1px solid #dee0e3',
                boxSizing: 'border-box',
                color: '#000',
                display: 'flex',
                flexFlow: 'column',
                flex: '1 1 auto',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                    'repeating-linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 10px, rgba(255,255,255,0) 10px, rgba(255,255,255,0) 20px )',
            }}>
            {props.label || 'Children'}
        </div>
    );
}

storiesOf('Layout', module)
    .add('Default', () => (
        <Layout>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
        </Layout>
    ))
    .add('With Plate', () => (
        <Layout>
            <Layout.Plate>
                <SpaceFiller height={50} label='Plate' />
            </Layout.Plate>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
        </Layout>
    ))
    .add('With Paging', () => (
        <Layout>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
            <Layout.Paging>
                <SpaceFiller height={30} label='Paging' />
            </Layout.Paging>
        </Layout>
    ))
    .add('With Plate and paging', () => (
        <Layout>
            <Layout.Plate>
                <SpaceFiller height={50} label='Plate' />
            </Layout.Plate>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
            <Layout.Paging>
                <SpaceFiller height={30} label='Paging' />
            </Layout.Paging>
        </Layout>
    ));
