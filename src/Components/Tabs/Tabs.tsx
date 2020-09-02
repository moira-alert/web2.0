import * as React from "react";
import { Tabs } from "@skbkontur/react-ui/components/Tabs";
import cn from "./Tabs.less";

type Props = {
    value: string;
    children: Array<React.ReactElement | null>;
};
type TabProps = {
    id: string;
    label: string;
    children: React.ReactNode;
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
                        {React.Children.map(children, (child) =>
                            child ? (
                                <TabsTab id={child.props.id}>{child.props.label}</TabsTab>
                            ) : null
                        )}
                    </Tabs>
                </div>
                {(React.Children.toArray(children) as React.ReactElement[]).filter(
                    ({ props }) => props.id === active
                )}
            </div>
        );
    }
}

export const { Tab } = TabsCustom;
