import React from "react";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import CodeRef from "../CodeRef/CodeRef";
import cn from "./TriggerEditForm.less";

export default function EditDescriptionHelp(): React.ReactElement {
    return (
        <div className={cn("edit-description-help")}>
            <HelpTooltip>
                <h4>Example templating:</h4>
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
                    <h4>String manipulations:</h4>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{"{{ stringsToUpper .Trigger.Name }}"}</CodeRef>,
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{"{{ stringsToLower .Trigger.Name }}"}</CodeRef>,
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{`{{ stringsReplace .Trigger.Name "<old>" "<new>" -1 }}`}</CodeRef>,
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{`{{ stringsTrimPrefix .Trigger.Name "replace_me" }}`}</CodeRef>,
                    </div>
                    <div className={cn("edit-description-help-message-row")}>
                        <CodeRef>{`{{ stringsTrimSuffix .Trigger.Name "replace_me" }}`}</CodeRef>.
                    </div>
                </div>
            </HelpTooltip>
        </div>
    );
}
