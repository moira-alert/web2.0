import React, { FC } from "react";
import { Layout, LayoutContent } from "../../Components/Layout/Layout";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { TriggerNoisinessChart } from "../../Components/TriggerNoisiness/TiggerNoisinessChart";

export const NoisinessContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <TriggerNoisinessChart />
            </LayoutContent>
        </Layout>
    );
};
