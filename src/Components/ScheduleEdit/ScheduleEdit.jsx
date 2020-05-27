// @flow
import * as React from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Radio } from "@skbkontur/react-ui/components/Radio";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import cn from "./ScheduleEdit.less";
import type { Schedule } from "../../Domain/Schedule";
import HelpTooltip from "../HelpTooltip/HelpTooltip";

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

    static formatTime(time: number): string {
        const HOUR_IN_DAY = 24;
        const MIN_IN_HOUR = 60;
        const hours =
            Math.floor(time / MIN_IN_HOUR) < HOUR_IN_DAY ? Math.floor(time / MIN_IN_HOUR) : 0;
        const minutes = time % MIN_IN_HOUR < MIN_IN_HOUR ? time % MIN_IN_HOUR : 0;
        return `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
    }

    static parseTime(time: string): number {
        const HOUR_IN_DAY = 24;
        const MIN_IN_HOUR = 60;
        const [hours, minutes] = time.split(":");
        const parsedHours = parseInt(hours, 10) < HOUR_IN_DAY ? parseInt(hours, 10) : 0;
        const parsedMinutes = parseInt(minutes, 10) < MIN_IN_HOUR ? parseInt(minutes, 10) : 0;
        return parsedHours * MIN_IN_HOUR + parsedMinutes;
    }

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
                            onValueChange={checked =>
                                onChange({
                                    ...schedule,
                                    days: [
                                        ...days.slice(0, i),
                                        { name, enabled: checked },
                                        ...days.slice(i + 1),
                                    ],
                                })
                            }
                        >
                            {name}
                        </Checkbox>
                    ))}
                </div>
                <div className={cn("group")}>
                    <span className={cn("radio")}>
                        <Radio
                            checked={allDay}
                            onValueChange={() => {
                                onChange({
                                    ...schedule,
                                    startOffset: 0,
                                    endOffset: 1439,
                                });
                                this.setState({ allDay: true });
                            }}
                            value="all_day"
                        >
                            All day
                        </Radio>
                    </span>
                    <span className={cn("radio")}>
                        <Radio
                            checked={!allDay}
                            value="specific_interval"
                            onValueChange={() => this.setState({ allDay: false })}
                        >
                            At specific interval
                        </Radio>
                        <Input
                            value={ScheduleEdit.formatTime(startOffset)}
                            width={60}
                            mask="99:99"
                            disabled={allDay}
                            onValueChange={value =>
                                onChange({
                                    ...schedule,
                                    startOffset: ScheduleEdit.parseTime(value),
                                })
                            }
                        />
                        <span>—</span>
                        <Input
                            value={ScheduleEdit.formatTime(endOffset)}
                            width={60}
                            mask="99:99"
                            disabled={allDay}
                            onValueChange={value =>
                                onChange({ ...schedule, endOffset: ScheduleEdit.parseTime(value) })
                            }
                        />
                        <HelpTooltip>
                            <div className={cn("time-range-description-title")}>
                                Either negative and positive intervals are allowed.
                            </div>
                            <div>
                                For example: 23:00 - 06:00 specifies interval between 23:00 <br />
                                of the current day to the 06:00 of the next day.
                            </div>
                        </HelpTooltip>
                    </span>
                </div>
            </div>
        );
    }
}
