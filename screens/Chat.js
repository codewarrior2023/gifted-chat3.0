import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
  } from 'react';
  import { TouchableOpacity, Text } from 'react-native';
  import { GiftedChat } from 'react-native-gifted-chat';
  import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    setDoc,
    doc,
    updateDoc
  } from 'firebase/firestore';
  import { auth, database } from '../config/firebase';
  import { AntDesign } from '@expo/vector-icons';
  import colors from '../colors';


  export default function Chat({navigation, route}) {
    const [firstMessage, setFirstMessage] = useState(true)
    const [messages, setMessages] = useState([]);

    const { authDocId, chatroomId, memberDocId, memberId, memberEmail } = route.params;

    

    useLayoutEffect(() => {
        navigation.setOptions({
          
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10
              }}
              onPress={() => {
                console.log(messages[0])
              }}
            >
              <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
            </TouchableOpacity>
          ),

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()

                updateDoc(doc(database, 'groups', auth.currentUser.uid, 'members', memberId), {
                  readMessage: false
                 })
              }}
            >
              <Text>
                Go Back
              </Text>
            </TouchableOpacity>
          )
          
        });
      }, [navigation]);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chatrooms', chatroomId, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
          setMessages(  
            querySnapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user
            }))
          );
        });
    return unsubscribe;
      }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
        // setMessages([...messages, ...messages]);
        const { _id, createdAt, text, user } = messages[0];  

        addDoc(collection(database, 'chatrooms', chatroomId, 'chats'), {
          _id,
          createdAt,
          text,
          user
        });

        // Members current login of users they are messaging

        setDoc(doc(database, 'groups', auth.currentUser.uid, 'members', memberId), {
          uid: memberId,
          email: memberEmail,
          lastMessage: messages,
          readMessage: false,
        });

        // adds the current user to the person they messaged room

        setDoc(doc(database, 'groups', memberId, 'members', auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          lastMessage: messages,
          readMessage: true,
        })
  
      }, []);

      return (
        // <>
        //   {messages.map(message => (
        //     <Text key={message._id}>{message.text}</Text>
        //   ))}
        // </>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          onSend={messages => onSend(messages)}
          messagesContainerStyle={{
            backgroundColor: '#fff'
          }}
          textInputStyle={{
            backgroundColor: '#fff',
            borderRadius: 20,
          }}
          user={{
            _id: auth?.currentUser?.email,
            avatar: 'https://i.pravatar.cc/300'
          }}
        />
      );
}

/*

        addDoc(collection(database, 'groups', auth.currentUser.uid, 'members'), {
          uid: memberId,
          email: memberEmail,
        });
*/

/*
     setDoc(doc(database, 'groups', auth.currentUser.uid, members, ), {
          uid: memberId,
          email: memberEmail,
        });
*/