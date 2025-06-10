import React, { FC, useState } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../../Components/Layout/Layout";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { TriggerNoisinessChart } from "../../Components/TriggerNoisiness/TiggerNoisinessChart";
import { ContactNoisinessChart } from "../../Components/ContactNosiness/ContactNoisinessChart";
import Tabs, { Tab } from "../../Components/Tabs/Tabs";
import classNames from "classnames/bind";

import styles from "./NoisinessContainer.module.less";

const cn = classNames.bind(styles);

export const NoisinessContainer: FC = () => {
    const { error } = useAppSelector(UIState);
    const [currentTab, setCurrentTab] = useState<string>("contacts");

    return (
        <Layout error={error}>
            <LayoutContent>
                <LayoutTitle>Noisiness</LayoutTitle>

                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <Tab id="contacts" label="Contacts">
                        <div className={cn("tabsContainer")}>
                            <ContactNoisinessChart />
                        </div>
                    </Tab>
                    <Tab id="triggers" label="Triggers">
                        <div className={cn("tabsContainer")}>
                            <TriggerNoisinessChart />
                        </div>
                    </Tab>
                </Tabs>
            </LayoutContent>
        </Layout>
    );
};
