// @flow
import * as React from "react";
import Link from "retail-ui/components/Link";
import Tooltip from "retail-ui/components/Tooltip";
import Input from "retail-ui/components/Input";
import Radio from "retail-ui/components/Radio";
import Checkbox from "retail-ui/components/Checkbox";
import cn from "./ScheduleEdit.less";
import type { Schedule } from "../../Domain/Schedule";

type Props = {
    schedule: Schedule,
    onChange: Schedule => void,
};

type State = {
    allDay: boolean,
};

export default class ScheduleEdit extends React.Component<Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        const { schedule } = props;
        const { startOffset, endOffset } = schedule;
        this.state = {
            allDay: startOffset === 0 && endOffset === 1439,
        };
    }

    formatTime(time: number): string {
        const HOUR_IN_DAY = 24;
        const MIN_IN_HOUR = 60;
        const hours = Math.floor(time / MIN_IN_HOUR) < HOUR_IN_DAY ? Math.floor(time / MIN_IN_HOUR) : 0;
        const minutes = time % MIN_IN_HOUR < MIN_IN_HOUR ? time % MIN_IN_HOUR : 0;
        return (hours > 9 ? hours : "0" + hours) + ":" + (minutes > 9 ? minutes : "0" + minutes);
    }

    parseTime(time: string): number {
        const HOUR_IN_DAY = 24;
        const MIN_IN_HOUR = 60;
        const [hours, minutes] = time.split(":");
        const parsedHours = parseInt(hours, 10) < HOUR_IN_DAY ? parseInt(hours, 10) : 0;
        const parsedMinutes = parseInt(minutes, 10) < MIN_IN_HOUR ? parseInt(minutes, 10) : 0;
        return parsedHours * MIN_IN_HOUR + parsedMinutes;
    }

    renderTimeRangeHelp = () => {
        return (
            <div>
                <div className={cn("time-range-description-title")}>
                    Either negative and positive intervals are allowed.
                </div>
                <div>
                    For example: 23:00 - 06:00 specifies interval between 23:00 <br />
                    of the current day to the 06:00 of the next day.
                </div>
            </div>
        );
    };

    render(): React.Node {
        const { allDay } = this.state;
        const { schedule, onChange } = this.props;
        const { days, startOffset, endOffset } = schedule;

        return (
            <div>
                <div className={cn("days")}>
                    {days.map(({ name, enabled }, i) => (
                        <Checkbox
                            key={name}
                            checked={enabled}
                            onChange={(e, checked) =>
                                onChange({
                                    ...schedule,
                                    days: [...days.slice(0, i), { name, enabled: checked }, ...days.slice(i + 1)],
                                })
                            }>
                            {name}
                        </Checkbox>
                    ))}
                </div>
                <div className={cn("group")}>
                    <span
                        className={cn("radio")}
                        onClick={() => {
                            onChange({
                                ...schedule,
                                startOffset: 0,
                                endOffset: 1439,
                            });
                            this.setState({ allDay: true });
                        }}>
                        <Radio checked={allDay} />
                        All day
                    </span>
                    <span className={cn("radio")} onClick={() => this.setState({ allDay: false })}>
                        <Radio checked={!allDay} />
                        <span>At specific interval</span>
                        <Input
                            value={this.formatTime(startOffset)}
                            width={60}
                            mask="99:99"
                            disabled={allDay}
                            onChange={(e, value) => onChange({ ...schedule, startOffset: this.parseTime(value) })}
                        />
                        <span>—</span>
                        <Input
                            value={this.formatTime(endOffset)}
                            width={60}
                            mask="99:99"
                            disabled={allDay}
                            onChange={(e, value) => onChange({ ...schedule, endOffset: this.parseTime(value) })}
                        />
                        <Tooltip pos="top right" render={this.renderTimeRangeHelp} trigger="click">
                            <Link icon="HelpDot" />
                        </Tooltip>
                    </span>
                </div>
            </div>
        );
    }
}
