"use strict";

import * as React from "react";
import isEqual from "lodash/isEqual";

import {CONFERENCE_CALL_MEMBERS_COUNT, CONFERENCE_CALL_MEMBERS_COUNT_PREMIUM} from "configs/constants";
import {IContact} from "modules/contacts/ContactsReducer";
import Avatar from "components/contacts/Avatar";
import {AvatarSize} from "components/contacts/style";
import {phoneMask} from "helpers/UIHelper";

interface IContactProps {
    contact: IContact;
    isSelected?: boolean;
    showSelection?: boolean;
    onSelect?: (username: string) => void;
    selectedContactsCount?: number
    user?: any
}

interface IContactState {

}

export default class Contact extends React.Component<IContactProps, IContactState> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps: Readonly<IContactProps>, nextState: Readonly<IContactState>, nextContext: any): boolean {

        if (!isEqual(nextProps.contact, this.props.contact)) {
            return true
        }

        if (!isEqual(nextProps.isSelected, this.props.isSelected)) {
            return true
        }

        if (!isEqual(nextProps.showSelection, this.props.showSelection)) {
            return true
        }

        if (!isEqual(nextProps.selectedContactsCount, this.props.selectedContactsCount)) {
            return true
        }

        return !isEqual(nextState, this.state);
    }

    handleContactClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const {isSelected, onSelect, selectedContactsCount, user} = this.props;

        const C_Count = user.get("premium") === "true" ? CONFERENCE_CALL_MEMBERS_COUNT_PREMIUM : CONFERENCE_CALL_MEMBERS_COUNT

        if (!isSelected && selectedContactsCount >= C_Count - 1) {
            return;
        }

        if (typeof isSelected !== 'undefined' && typeof onSelect === 'function') {
            const username: string = e.currentTarget.getAttribute('data-value');
            onSelect(username);
        }
    };

    render() {
        const {contact, selectedContactsCount, isSelected = false, showSelection, user} = this.props;
        const contactId: string = contact.contactId;
        const threadImage: any = {
            url: contact.avatarUrl,
            file: contact.avatar,
        };
        const username = contact.username;

        const C_Count = user.get("premium") === "true" ? CONFERENCE_CALL_MEMBERS_COUNT_PREMIUM : CONFERENCE_CALL_MEMBERS_COUNT

        return (
            <div onClick={this.handleContactClick} data-value={username} className="contact">
                <div className="contact-block"
                     style={!isSelected && selectedContactsCount >= C_Count - 1 ? {opacity: 0.6} : {}}>
                    <AvatarSize margin="0 12px 0 0">
                    <Avatar
                        image={threadImage}
                        color={contact.color.numberColor}
                        status={contact.status}
                        avatarCharacter={contact.avatarCharacter}
                        name={contact.firstName}
                        meta={{threadId: contactId}}
                    />
                    </AvatarSize>
                    <div className="contact-content">

                        <div className="text-block">
                            <div
                                className="user-name"
                                style={{display: !contact.firstName && !contact.lastName ? "none" : "block"}}
                            >{contact.firstName} {contact.lastName} </div>
                            <div className={`user-info ${!contact.firstName && !contact.lastName ? "no-name" : ""}`}>
                                {contact.email || `${phoneMask(username)}`}
                            </div>
                        </div>
                        {showSelection && <div className={`select ${isSelected ? "isSelected" : ""}`}/>}
                    </div>

                </div>
            </div>
        );
    }
};
