import * as React from "react";
import { Tabs } from "@skbkontur/react-ui/components/Tabs";
import cn from "./Tabs.less";

type Props = {
    value: string;
    children: React.ReactElement;
};
type TabProps = {
    id: string;
    label: string;
    children: React.ReactElement;
};
type State = {
    active: string;
};

const TabsTab = Tabs.Tab;

export default class TabsCustom extends React.Component<Props, State> {
    public state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            active: props.value,
        };
    }

    static Tab = function Tab({ children }: TabProps): React.ReactElement {
        return <div>{children}</div>;
    };

    render(): React.ReactElement {
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
                <div className={cn("header")}>
                    <Tabs
                        value={active}
                        onValueChange={(value) => this.setState({ active: value })}
                    >
                        {React.Children.map<React.ReactElement, React.ReactElement>(
                            children,
                            ({ props }) => (
                                <TabsTab id={props.id}>{props.label}</TabsTab>
                            )
                        )}
                    </Tabs>
                </div>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {React.Children.toArray(children).filter(({ props }) => props.id === active)}
            </div>
        );
    }
}

export const { Tab } = TabsCustom;
