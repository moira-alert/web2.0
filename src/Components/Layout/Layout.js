// @flow
import React from 'react';
import Loader from 'retail-ui/components/Loader';
import cn from './Layout.less';
type LayoutProps = {|
    children?: any;
    loading?: boolean;
    loadingError?: boolean;
|};
type ErrorMessageProps = {|
    children?: string;
|};
type PlateProps = {|
    children?: any;
|};
type ContentProps = {|
    children?: any;
|};
type PagingProps = {|
    children?: any;
|};
export default class Layout extends React.Component {
    props: LayoutProps;

    static ErrorMessage = function ErrorMessage({ children }: ErrorMessageProps): React.Element<*> {
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

    static Content = function Content({ children }: ContentProps): React.Element<*> {
        return (
            <div className={cn('content')}>
                <div className={cn('container')}>{children}</div>
            </div>
        );
    };

    static Paging = function Paging({ children }: PagingProps): React.Element<*> {
        return (
            <div className={cn('paging')}>
                <div className={cn('container')}>{children}</div>
            </div>
        );
    };

    render(): React.Element<*> {
        const { loading = false, loadingError = false, children } = this.props;
        return (
            <main className={cn('layout')}>
                <Loader
                    className={cn('loading')}
                    active={loading}
                    caption={loadingError ? 'Network error. Please, reload page' : 'Loading'}>
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
