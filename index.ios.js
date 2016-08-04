/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { NativeModules } from 'react-native';


var WXPay = NativeModules.WXPay;
let appid = 'wxd930ea5d5a258f4f';

function show(title, msg) {
    AlertIOS.alert(title+'', msg+'');
}

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AlertIOS,
  ScrollView,
  TouchableHighlight,
  NativeAppEventEmitter
} from 'react-native';

class TextReactNative extends Component {
  omponentDidMount() {

        this.registerApp();

        NativeAppEventEmitter.addListener(
            'finishedPay',
            (response) => {
                if (parseInt(response.errCode) === 0) {
                    alert('支付成功');
                } else {
                    alert(response.strMsg);
                }
            }
        );
    }

    registerApp() {
        WXPay.registerApp(appid, (res) => {
            show('registerApp', res);
        });
    }


    isWXAppInstalled() {
        WXPay.isWXAppInstalled((res) => {
            show('isWXAppInstalled', res);
        });
    }


    isWXAppSupportApi() {
        WXPay.isWXAppSupportApi((res) => {
            show('isWXAppSupportApi', res);
        });
    }



    wechatPay() {
        WXPay.wechatPay({
            'timeStamp': '1412000000',
            'partnerId': '1900000109',
            'prepayId': 'WX1217752501201407033233368018',
            'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
            'packageValue': 'Sign=WXPay',
            'sign': 'C380BEC2BFD727A4B6845133519F3AD6'
        });
    }


    render() {
        return (
            <ScrollView contentContainerStyle={styles.wrapper}>
                
                <Text style={styles.pageTitle}>WeChat SDK for React Native (iOS)</Text>

                <TouchableHighlight 
                    style={styles.button} underlayColor="#f38"
                    onPress={this.registerApp}>
                    <Text style={styles.buttonTitle}>registerApp</Text>
                </TouchableHighlight>

                
                <TouchableHighlight 
                    style={styles.button} underlayColor="#f38"
                    onPress={this.isWXAppInstalled}>
                    <Text style={styles.buttonTitle}>isWXAppInstalled</Text>
                </TouchableHighlight>

                <TouchableHighlight 
                    style={styles.button} underlayColor="#f38"
                    onPress={this.isWXAppSupportApi}>
                    <Text style={styles.buttonTitle}>isWXAppSupportApi</Text>
                </TouchableHighlight>


                <TouchableHighlight 
                    style={styles.button} underlayColor="#f38"
                    onPress={this.wechatPay}>
                    <Text style={styles.buttonTitle}>wechatPay</Text>
                </TouchableHighlight>

                
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  wrapper: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
    },
    pageTitle: {
        paddingBottom: 40
    },
    button: {
        width: 200,
        height: 40,
        marginBottom: 10,
        borderRadius: 6,
        backgroundColor: '#f38',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        fontSize: 16,
        color: '#fff'
    }
  
});


AppRegistry.registerComponent('TextReactNative', () => TextReactNative);
