import React from "react";
import { Link } from "@skbkontur/react-ui/components/Link";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import CodeRef from "../CodeRef/CodeRef";
import cn from "./TriggerEditForm.less";

export default function EditDescriptionHelp(): React.ReactElement {
    return (
        <div className={cn("edit-description-help")}>
            <HelpTooltip>
                <h4>Example:</h4>
                <div className={cn("edit-description-help-message")}>
                    Trigger name:
                    <div>
                        <CodeRef>{"{{.Trigger.Name}}"}</CodeRef>
                    </div>
                    Events:
                    <div>
                        <CodeRef>{"{{range $v := .Events }}"}</CodeRef>
                    </div>
                    Metric:
                    <div>
                        <CodeRef>{"{{$v.Metric}}"}</CodeRef>
                    </div>
                    Metric elements:
                    <div>
                        <CodeRef>
                            {"{{range $i, $e := $v.MetricElements}}{{$i}}={{$e}}{{end}}"}
                        </CodeRef>
                    </div>
                    Value metric:
                    <div>
                        <CodeRef>{"{{$v.Value}}"}</CodeRef>
                    </div>
                    State:
                    <div>
                        <CodeRef>{"{{$v.State}}"}</CodeRef>
                    </div>
                    Time:
                    <div>
                        <CodeRef>{"{{$v.Timestamp}}"}</CodeRef>
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{"[Dashboard: {{$v.Metric}}](https://grafana/?orgId=1)"}</CodeRef>
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{"{{end}}"}</CodeRef>
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        See availible methods and more in{" "}
                        <Link
                            target="_blank"
                            href="https://moira.readthedocs.io/en/latest/user_guide/advanced.html#templates"
                        >
                            docs
                        </Link>
                        .
                    </div>
                </div>
            </HelpTooltip>
        </div>
    );
}
