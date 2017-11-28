/**
 * Personal details component
 * @sara
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;
const SCREENHEIGHT = Dimensions.get('window').height;


export default class PersonalDetails extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      first_name: this.props.first_name,
      last_name: this.props.last_name,
      contact: this.props.last_name
    };

  }


  render() {
    return (
      <View style={styles.fill}>

            <Text style={styles.divTxt}>Personal details</Text>

            <TextInput
              style={styles.txtInput}
              onChangeText={(text) => this.setState({first_name:text})}
              placeholder="First name"
              placeholderTextColor="#A9ACBC"
              ref={component => this.first_name = component}
              underlineColorAndroid='transparent'
            />

             <View style={styles.divider}></View>

             <TextInput
               style={styles.txtInput}
               onChangeText={(text) => this.setState({last_name:text})}
               placeholder="Last name"
               placeholderTextColor="#A9ACBC"
               ref={component => this.last_name = component}
               underlineColorAndroid='transparent'
             />

              <View style={styles.divider}></View>


             <TextInput
               style={styles.txtInput}
               onChangeText={(text) => this.setState({contact:text})}
               placeholder="Contact"
               placeholderTextColor="#A9ACBC"
               ref={component => this.contact = component}
               underlineColorAndroid='transparent'
             />

              <View style={styles.divider}></View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill:{
    flex: 1,
  },
  divTxt:{
    backgroundColor: "#F7F7F9",
    color: "#696E74",
    fontSize: 15,
    fontWeight: "600",
    width: SCREENWIDTH,
    textAlign: "left",
    padding: 10,
  },
  txtInput:{
    height: 45,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#FFFFFF',
    width: SCREENWIDTH - 10,
    marginTop: 10,
    fontSize: 15,
  },
  divider:{
    marginLeft: 25,
    marginRight: 25,
    height: 1,
    backgroundColor: 'rgba(131,155,240,0.3)',
  }

});
