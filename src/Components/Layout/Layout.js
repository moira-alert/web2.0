// @flow
import React from 'react';
import Loader from 'retail-ui/components/Loader';
import Icon from 'retail-ui/components/Icon';
import cn from './Layout.less';
type LayoutProps = {|
    children?: any,
    loading?: boolean,
    error?: ?string,
|};
type ErrorMessageProps = {|
    children?: string,
|};
type PlateProps = {|
    children?: any,
|};
type ContentProps = {|
    children?: any,
|};
type PagingProps = {|
    children?: any,
|};
export default class Layout extends React.Component {
    props: LayoutProps;

    static ErrorMessage = function ErrorMessage({
        children,
    }: ErrorMessageProps): React.Element<*> {
        return (
            <div className={cn('error')}>
                <div className={cn('container')}>{children}</div>
            </div>
        );
    };

    static Plate = function Plate({ children }: PlateProps): React.Element<*> {
        return (
            <div className={cn('grey-plate')}>
                <div className={cn('container')}>{children}</div>
            </div>
        );
    };

    static Content = function Content({
        children,
    }: ContentProps): React.Element<*> {
        return (
            <div className={cn('content')}>
                <div className={cn('container')}>{children}</div>
            </div>
        );
    };

    static Paging = function Paging({
        children,
    }: PagingProps): React.Element<*> {
        return (
            <div className={cn('paging')}>
                <div className={cn('container')}>{children}</div>
            </div>
        );
    };

    render(): React.Element<*> {
        const { loading = false, error = null, children } = this.props;
        return (
            <main className={cn('layout')}>
                {error && (
                    <div className={cn('error')}>
                        <Icon name="Warning" /> {error}
                    </div>
                )}
                <Loader
                    className={cn('loading')}
                    active={loading}
                    caption="Loading"
                >
                    {children}
                </Loader>
            </main>
        );
    }
}

export const LayoutErrorMessage = Layout.ErrorMessage;
export const LayoutPlate = Layout.Plate;
export const LayoutContent = Layout.Content;
export const LayoutPaging = Layout.Paging;
