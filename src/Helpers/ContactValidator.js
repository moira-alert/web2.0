// @flow
import * as React from "react";
import { ContactTypes } from "../Domain/ContactType";
import { type ContactConfig } from "../Domain/Config";
import type { ValidationInfo } from "react-ui-validations";

export default function validateContact(contactConfig: ContactConfig, value: string): ?ValidationInfo {
    const contactType = contactConfig.type;
    switch (contactType) {
        case ContactTypes.email: {
            if (value == null || value.trim() === "" || !value.includes("@")) {
                return { message: "Please enter a valid email address", type: "submit" };
            }
            break;
        }
        case ContactTypes.pushover: {
            if (value == null || value.trim() === "" || value.trim().includes(" ")) {
                return { message: "Please enter a valid pushover user key", type: "submit" };
            }
            break;
        }
        case ContactTypes.telegram: {
            if (value == null || value.trim() === "") {
                return { message: "Enter a valid telegram #channel, @username or group", type: "submit" };
            }
            break;
        }
        case ContactTypes.slack: {
            if (value == null || value.trim() === "") {
                return { message: "Enter a valid telegram #channel, @username or group", type: "submit" };
            }
            break;
        }
        case ContactTypes["twilio sms"]:
        case ContactTypes["twilio voice"]: {
            if (value == null || value.trim() === "") {
                return { message: "Enter your phone number", type: "submit" };
            }
            if (!/((\+7)|8)?\d{10}/.test(value.trim())) {
                return {
                    message: (
                        <span>
                            Enter a valid russian phone number
                            <br />
                            Phone number should starts with 8 or +7.
                        </span>
                    ),
                    type: "submit",
                };
            }
            break;
        }
        default:
            if (contactConfig.validation != null && contactConfig.validation !== "") {
                try {
                    const regexp = new RegExp(contactConfig.validation);
                    if (!regexp.test(value)) {
                        return {
                            message: `Please enter value in correct format${
                                contactConfig.help != null && contactConfig.help !== ""
                                    ? ": " + contactConfig.help
                                    : "."
                            }`,
                            type: "submit",
                        };
                    }
                } catch (e) {
                    return null;
                }
            }
    }
    return null;
}
