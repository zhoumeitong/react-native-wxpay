/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
// import { NativeModules } from 'react-native';
// var WXPay = NativeModules.WXPay;
import WXPay from 'react-native-wxpay';

let appid = 'wx51b8febede7ca75b';

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
  componentDidMount() {
        this.registerApp();
        NativeAppEventEmitter.addListener(
            'finishedPay',
            (response) => {
                if (parseInt(response.errCode) === 0) {
                    alert('支付成功');
                }else if (parseInt(response.errCode) === -2){
                    alert('用户取消');
                }else {
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
        WXPay.pay({
            'timestamp': '1471493055',
            'partnerid': '1224611601',
            'prepayid': 'wx20160818120419369dce20100669024325',
            'noncestr':'dc10e7a567a4c5e9e590c31da891b01d',
            'package': 'Sign=WXPay',
            'sign': '9A7F7DE306C90C92145A4A9F881BA8C0'
        },(res) => {
            
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
