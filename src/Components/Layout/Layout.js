// @flow
import * as React from "react";
import Loader from "retail-ui/components/Loader";
import Icon from "retail-ui/components/Icon";
import cn from "./Layout.less";

type LayoutProps = ReactExactProps<{
    children?: any,
    loading?: boolean,
    error?: ?string,
}>;
type PlateProps = ReactExactProps<{
    children?: any,
}>;
type TitleProps = ReactExactProps<{
    children: string,
}>;
type ContentProps = ReactExactProps<{
    children?: any,
}>;
type PagingProps = ReactExactProps<{
    children?: any,
}>;

export default class Layout extends React.Component<LayoutProps> {
    props: LayoutProps;

    static Plate = function Plate({ children }: PlateProps): React.Node {
        return (
            <div className={cn("grey-plate")}>
                <div className={cn("container")}>{children}</div>
            </div>
        );
    };

    static Title = function Title({ children }: TitleProps): React.Node {
        return <h1 className={cn("title")}>{children}</h1>;
    };

    static Content = function Content({ children }: ContentProps): React.Node {
        return (
            <div className={cn("content")}>
                <div className={cn("container")}>{children}</div>
            </div>
        );
    };

    static Footer = function Paging({ children }: PagingProps): React.Node {
        return (
            <div className={cn("paging")}>
                <div className={cn("container")}>{children}</div>
            </div>
        );
    };

    render(): React.Node {
        const { loading = false, error = null, children } = this.props;
        return (
            <main className={cn("layout")}>
                {error && (
                    <div className={cn("error")}>
                        <Icon name="Warning" /> {error}
                    </div>
                )}
                <Loader className={cn("loading")} active={loading} caption="Loading">
                    {children}
                </Loader>
            </main>
        );
    }
}

export const LayoutTitle = Layout.Title;
export const LayoutPlate = Layout.Plate;
export const LayoutContent = Layout.Content;
export const LayoutFooter = Layout.Footer;
