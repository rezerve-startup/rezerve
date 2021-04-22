import { Avatar, Button, createStyles, Paper, TextField, Theme, Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { StoreState } from '../store/types';
import { setUserEmployeeConversations, setUserCustomerConversations } from '../store/actions';
import Sidebar from '../sidebar/Sidebar';
import { firestore } from '../../config/FirebaseConfig';
import { ArrowUpward, Close } from '@material-ui/icons';
import firebase from 'firebase';

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

const ScrollToBottom = () => {
    const elementRef: any = useRef();
    useEffect(() => ((elementRef.current as any).scrollIntoView()));
    return <div ref={elementRef} />;
}

class MessagingHome extends React.Component<any, any> {
    constructor(props) {
        super(props);
        
        this.state = {
            conversationSelectedOn: false,
            selectedConversation: null,
            messageToSend: ''
        }
    }

    componentDidMount() {
        if (this.props.user !== undefined) {
            this.getConversations();
        }
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

                                    conversationData.conversationId = conversationDoc.id;

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

                                    conversationData.conversationId = conversationDoc.id;

                                    conversations.push(conversationData);

                                    this.dispatchSetUserEmployeeConversations(conversations);
                                });
                            });
                    });
                });
        }
    }

    handleOnChangeMessage(e) {
        this.setState({
            messageToSend: e.target.value
        });
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
                            <Paper key={index} onClick={() => this.selectConversation(convo)} className={classes.outerConvoContainer}>
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

        let otherUser = this.state.selectedConversation.customer ? this.state.selectedConversation.customer : this.state.selectedConversation.employee;

        return (
            <div className={classes.selectedConversationContainer}>
                <div className={classes.conversationHeader}>
                    <div className={classes.conversationHeaderInfo}>
                        <Avatar />
                        <Typography className={classes.conversationHeaderText}>{otherUser.firstName}</Typography>
                    </div>
                    <div className={classes.selectedConversationClose}>
                        <div onClick={() => this.closeSelectedConversation()}>
                            <Close color="primary" fontSize="large"/>
                        </div>
                    </div>
                </div>

                <div className={classes.messagesDisplay}>
                    {this.state.selectedConversation?.messages.map((messageData, index) => {
                        if (messageData.senderId === this.props.senderId) {
                            return (
                                <div key={index} className={classes.currentUserMessage}>
                                    <div className={classes.currentUserMessageBoxStyling}>
                                        <div className={classes.currentUserMessageContent}>{messageData.message}</div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} className={classes.otherUserMessage}>
                                    <div className={classes.otherUserMessageBoxStyling}>
                                        <div className={classes.otherUserMessageContent}>{messageData.message}</div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                    <ScrollToBottom />
                </div>

                <div className={classes.sendMessageContainer}>
                    <TextField 
                        className={classes.messageToSend} 
                        type="text"
                        value={this.state.messageToSend}
                        onChange={(e) => this.handleOnChangeMessage(e)}
                    />
                    <Button variant="contained" color="primary" className={classes.sendArrow} onClick={() => this.sendMessage()} disabled={this.state.messageToSend === '' ? true : false}>
                        <ArrowUpward />
                    </Button>
                </div>
            </div>
        );
    }

    sendMessage() {
        if (this.state.messageToSend !== '') {
            let messagesToUpdate= this.state.selectedConversation.messages;

            const messageToAdd = {
                senderId: this.props.senderId,
                message: this.state.messageToSend,
                datetime: firebase.firestore.Timestamp.fromDate(new Date(Date.now()))
            }

            messagesToUpdate.push(messageToAdd);

            firestore.collection('messages').doc(`${this.state.selectedConversation.conversationId}`).update({
                messages: messagesToUpdate
            }).then(() => {
                this.setState({
                    messageToSend: ''
                });
            })
        }
    }

    selectConversation(conversationToSelect) {
        this.setState({
            conversationSelectedOn: true,
            selectedConversation: conversationToSelect
        })
    }

    closeSelectedConversation() {
        this.setState({
            conversationSelectedOn: false,
            selectedConversation: null
        });

        this.getConversations();
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
                        this.renderSelectedConversation()
                    ) : (
                        <div className={classes.conversationsContainer}>
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
        backgroundColor: theme.palette.secondary.dark,
        height: '100%'
    },
    messagingContainer: {
        height: '92.5vh',
    },
    conversationsContainer: {
        padding: '1rem'
    },
    messagingHeaderText: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: 'white'
    },
    noCurrentConversations: {
        fontStyle: 'italic'
    },
    convoContainer: {
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center'
    },
    outerConvoContainer: {
        marginTop: '1rem'
    },
    convoAvatar: {
        marginRight: '1.5rem'
    },
    convoOtherPersonHeader: {
        fontStyle: 'italic'
    },
    currentUserMessageBoxStyling: {
        borderColor: theme.palette.primary.main,
        borderRadius: '2rem',
        marginBottom: '0.5rem',
        maxWidth: '40vw',
        display: 'inline-block',
        overflow: 'auto',
    },
    otherUserMessageBoxStyling: {
        borderColor: 'gray',
        borderRadius: '2rem',
        marginBottom: '0.5rem',
        maxWidth: '40vw',
        display: 'inline-block',
        overflow: 'auto',
    },
    currentUserMessage: {
        justifyContent: 'right',
        textAlign: 'right',
        paddingRight: '1rem'
    },
    otherUserMessage: {
        justifyContent: 'left',
        textAlign: 'left',
        paddingLeft: '1rem'
    },
    currentUserMessageContent: {
        padding: '1rem',
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    },
    otherUserMessageContent: {
        padding: '1rem',
        backgroundColor: 'gray',
        color: 'white'
    },
    selectedConversationContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    messagesDisplay: {
        width: '100%',
        flex: 5,
        overflow: 'auto'
    },
    conversationHeader: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: '0.5rem',
        flex: 1
    },
    conversationHeaderInfo: {
        display: 'flex',
        alignItems: 'center',
        flex: 8,
        marginLeft: '1rem'
    },
    conversationHeaderText: {
        color: 'white',
        marginLeft: '2rem',
        fontSize: '1.5rem'
    },
    selectedConversationClose: {
        flex: 0.5,
        marginRight: '1rem'
    },
    sendMessageContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: '0.5rem',
        backgroundColor: 'lightgray',
        flex: 1
    },
    messageToSend: {
        backgroundColor: 'white',
        margin: '1rem',
        flexGrow: 8
    },
    sendArrow: {
        flex: 1,
        marginRight: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
  });

export default connect(mapStateToProps, { setUserCustomerConversations, setUserEmployeeConversations })(
    withStyles(styles, { withTheme: true })(MessagingHome)
)