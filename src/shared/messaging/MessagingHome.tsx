import { Avatar, createStyles, Paper, Theme, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { StoreState } from '../store/types';
import { setUserEmployeeConversations, setUserCustomerConversations } from '../store/actions';
import Sidebar from '../sidebar/Sidebar';
import { firestore } from '../../config/FirebaseConfig';

function mapStateToProps(state: StoreState) {
    let employeeConversationsToAdd: any = undefined;
    let customerConversationsToAdd: any = undefined;

    let senderId: any = undefined;

    if (state.system.user !== undefined) {
        if (state.system.user.employeeInfo && state.system.user.employeeInfo.conversations) {
            employeeConversationsToAdd = [];
            senderId = state.system.user.employeeId;

            for (const conversation of state.system.user.employeeInfo.conversations) {
                employeeConversationsToAdd.push(conversation);
            }

            employeeConversationsToAdd.sort((convo1, convo2) => convo2.lastMessageDatetime.toDate() - convo1.lastMessageDatetime.toDate());

            customerConversationsToAdd = undefined;
        } else if (state.system.user.customerInfo && state.system.user.customerInfo.conversations) {
            customerConversationsToAdd = [];
            senderId = state.system.user.customerId;
            
            for (const conversation of state.system.user.customerInfo.conversations) {
                customerConversationsToAdd.push(conversation);
            }

            customerConversationsToAdd.sort((convo1, convo2) => convo2.lastMessageDatetime.toDate() - convo1.lastMessageDatetime.toDate())

            employeeConversationsToAdd = undefined;
        }
    }

    return ({
        user: state.system.user,
        employeeConversations: employeeConversationsToAdd,
        customerConversations: customerConversationsToAdd,
        senderId: senderId
    })
}

class MessagingHome extends React.Component<any, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            conversationSelectedOn: false,
            selectedConversation: null
        }
    }

    componentDidMount() {
        this.getConversations();
    }

    dispatchSetUserEmployeeConversations(employeeConversations: any[]) {
        this.props.setUserEmployeeConversations(employeeConversations);
    }

    dispatchSetUserCustomerConversations(customerConversations: any[]) {
        this.props.setUserCustomerConversations(customerConversations);
    }

    getConversations() {
        if (this.props.user.employeeId === '') {
            firestore.collection('messages').where('customerId', '==', `${this.props.user.customerId}`).get()
                .then((querySnapshot) => {
                    let conversations: any[] = [];

                    querySnapshot.forEach((conversationDoc) => {
                        const conversationData = conversationDoc.data();

                        firestore.collection('users').where('employeeId', '==', `${conversationData.employeeId}`).get()
                            .then((querySnapshot) => {
                                querySnapshot.forEach((userDoc) => {
                                    const userData = userDoc.data();

                                    conversationData.employee = {
                                        firstName: userData.firstName,
                                        lastName: userData.lastName
                                    }

                                    conversations.push(conversationData);

                                    this.dispatchSetUserCustomerConversations(conversations);
                                });
                            });
                    });
                });
        } else {
            firestore.collection('messages').where('employeeId', '==', `${this.props.user.employeeId}`).get()
                .then((querySnapshot) => {
                    let conversations: any[] = [];

                    querySnapshot.forEach((conversationDoc) => {
                        const conversationData = conversationDoc.data();

                        firestore.collection('users').where('customerId', '==', `${conversationData.customerId}`).get()
                            .then((querySnapshot) => {
                                querySnapshot.forEach((userDoc) => {
                                    const userData = userDoc.data();

                                    conversationData.customer = {
                                        firstName: userData.firstName,
                                        lastName: userData.lastName
                                    }

                                    conversations.push(conversationData);

                                    this.dispatchSetUserEmployeeConversations(conversations);
                                });
                            });
                    });
                });
        }
    }

    renderCurrentConversations() {
        const { classes } = this.props;
        
        if (this.props.employeeConversations !== undefined) {
            if (this.props.employeeConversations.length === 0) {
                return <Typography className={classes.noCurrentConversations}>No Current Messages</Typography>
            } else {
                return (
                    <div>
                        {this.props.employeeConversations?.map((convo, index) => (
                            <Paper key={index} onClick={() => this.selectConversation(convo)}>
                                <div className={classes.convoContainer}>
                                    <Avatar className={classes.convoAvatar} />
                                    <div>
                                        <Typography className={classes.convoOtherPersonHeader}>{convo.customer.firstName} {convo.customer.lastName}</Typography>
                                        <Typography>{convo.messages[convo.messages.length - 1].message}</Typography>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </div>
                )
            }
        } else if (this.props.customerConversations !== undefined) {
            if (this.props.customerConversations.length === 0) {
                return <Typography className={classes.noCurrentConversations}>No Current Messages</Typography>
            } else {
                return (
                    <div>
                        {this.props.customerConversations?.map((convo, index) => (
                            <Paper key={index} onClick={() => this.selectConversation(convo)}>
                                <div className={classes.convoContainer}>
                                    <Avatar className={classes.convoAvatar} />
                                    <div>
                                        <Typography className={classes.convoOtherPersonHeader}>{convo.employee.firstName} {convo.employee.lastName}</Typography>
                                        <Typography>{convo.messages[convo.messages.length - 1].message}</Typography>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </div>
                )
            }
        }
    }

    renderSelectedConversation() {
        const { classes } = this.props;

        return (
            <div className={classes.selectedConversationWidth}>
                {this.state.selectedConversation?.messages.map((messageData, index) => {
                    if (messageData.senderId === this.props.senderId) {
                        return (
                            <div key={index} className={classes.currentUserMessage}>
                                <div className={classes.messageBoxStyling}>
                                    <div className={classes.messageContent}>{messageData.message}</div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={index} className={classes.otherUserMessage}>
                                <div className={classes.messageBoxStyling}>
                                    <div className={classes.messageContent}>{messageData.message}</div>
                                </div>
                            </div>
                        )
                    }
                })}

                <div>
                    
                </div>
            </div>
        );

    }

    selectConversation(conversationToSelect) {
        console.log(conversationToSelect);
        this.setState({
            conversationSelectedOn: true,
            selectedConversation: conversationToSelect
        })
    }

    render() {
        const { classes } = this.props;

        if (this.props.user === undefined) {
            return <Redirect to={'/'} />
        }

        return (
            <div className={classes.root}>
                <Sidebar />
                <div className={classes.messagingContainer}>
                    {this.state.conversationSelectedOn ? (
                        <div>
                            {this.renderSelectedConversation()}
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.messagingHeaderText}>Messages</Typography>
                            {this.renderCurrentConversations()}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    messagingContainer: {
        padding: '1rem'
    },
    messagingHeaderText: {
        fontSize: '1.5rem',
        marginBottom: '1rem'
    },
    noCurrentConversations: {
        fontStyle: 'italic'
    },
    convoContainer: {
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center'
    },
    convoAvatar: {
        marginRight: '1.5rem'
    },
    convoOtherPersonHeader: {
        fontStyle: 'italic'
    },
    messageBoxStyling: {
        border: '3px solid black',
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        maxWidth: '40vw',
        display: 'inline-block',
        overflow: 'auto'
    },
    currentUserMessage: {
        justifyContent: 'right',
        textAlign: 'right',
    },
    otherUserMessage: {
        justifyContent: 'left',
        textAlign: 'left',
    },
    messageContent: {
        padding: '0.5rem'
    },
    selectedConversationWidth: {
        width: '100%',
        verticalAlign: 'top'
    }
  });

export default connect(mapStateToProps, { setUserCustomerConversations, setUserEmployeeConversations })(
    withStyles(styles, { withTheme: true })(MessagingHome)
)