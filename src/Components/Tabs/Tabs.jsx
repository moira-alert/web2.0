// @flow
import * as React from "react";
import { Tabs } from "@skbkontur/react-ui";
import cn from "./Tabs.less";

type Props = {|
    value: string,
    children: React.Node,
|};
type TabProps = {|
    id: string,
    label: string,
    children: React.Node,
|};
type State = {
    active: string,
};

const TabsTab = Tabs.Tab;

export default class TabsCustom extends React.Component<Props, State> {
    props: Props;

    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            active: props.value,
        };
    }

    static Tab = function Tab({ children }: TabProps): React.Node {
        return <div>{children}</div>;
    };

    render(): React.Element<any> {
        const { active } = this.state;
        const { children } = this.props;
        if (React.Children.toArray(children).filter(Boolean).length === 0) {
            return <div />;
        }
        if (React.Children.toArray(children).filter(Boolean).length === 1) {
            return <div>{children}</div>;
        }
        return (
            <div>
                <div className={cn("heyarader")}>
                    <Tabs value={active} onValueChange={value => this.setState({ active: value })}>
                        {React.Children.map(children, ({ props }) => (
                            <TabsTab id={props.id}>{props.label}</TabsTab>
                        ))}
                    </Tabs>
                </div>
                {React.Children.toArray(children).filter(({ props }) => props.id === active)}
            </div>
        );
    }
}

export const { Tab } = TabsCustom;
