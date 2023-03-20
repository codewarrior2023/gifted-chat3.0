import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet, Touchable } from "react-native";
import { query, collection, onSnapshot, orderBy, limit, setDoc, updateDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { auth, database } from "../config/firebase";
const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";


export default function Rooms({navigation}) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const q = query(collection(database, 'groups', auth.currentUser.uid, 'members'))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let usersArray = []
          querySnapshot.forEach((doc) => {
            usersArray.push({...doc.data(), id: doc.id})
          });
          setUsers(usersArray)
        })
        return () => unsubscribe()
      }, []);

      const renderItem = ({item}) => {

        return( 

            <View style={styles.userContainer}>  

                {item.readMessage === true && (

                    <Image
                        source={require('../assets/checked.png')}
                        style={styles.image}
                        resizeMode='contain'
                    />

                )}
                <Text> 
                    {item.email}
                </Text>
                <Text>
                    {item.lastMessage[0].text}
                </Text>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                        let authUserId = auth.currentUser.uid;
                        let messUserId = item.uid;
                        let chatroomId;

                        if (authUserId[0] < messUserId[0]) {
                            chatroomId = authUserId + messUserId;
                        } else {
                            chatroomId = messUserId + authUserId;
                        }

                       updateDoc(doc(database, 'groups', auth.currentUser.uid, 'members', item.uid), {
                        readMessage: false
                       })

                       navigation.navigate('Chat', {
                        chatroomId: chatroomId,
                        memberId: item.uid, 
                        memberEmail: item.email,
                       })

                    }}
                >
                    <Text> Send Message </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    console.log(item.readMessage)
                }}>
                    <Text>
                        Click
                    </Text>
                </TouchableOpacity>
            </View>
        );
      }

    return(
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
        
    
    );
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#fff",
        },
        list: {
            marginTop: 100,
        },
        userContainer: {
            backgroundColor: '#f8f8f8',
            width: 375,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            margin: 20,
        },
        image: {
            width: 25,
            height: 25,
        },
    });