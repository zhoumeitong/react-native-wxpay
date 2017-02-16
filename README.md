# react-native-wxpay

功能：
通过微信SDK实现微信支付功能

一、链接WXPay库

参考http://reactnative.cn/docs/0.28/linking-libraries-ios.html#content

1、添加react-native-wxpay插件到你工程的node_modules文件夹下

2、添加AMap库中的.xcodeproj文件在你的工程中

3、点击你的主工程文件，选择Build Phases，然后把刚才所添加进去的.xcodeproj下的Products文件夹中的静态库文件（.a文件），拖到Link Binary With Libraries组内。

4、由于AppDelegate中使用WXPay库,所以我们需要打开你的工程文件，选择Build Settings，然后搜索Header Search Paths，然后添加库所在的目录。


二、开发环境配置

参考
https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=1417694084&token=&lang=zh_CN

1、引入系统库
左侧目录中选中工程名，在TARGETS->Build Phases-> Link Binary With Libaries中点击“+”按钮，在弹出的窗口中查找并选择所需的库（见下图），单击“Add”按钮，将库文件添加到工程中。

![](http://upload-images.jianshu.io/upload_images/2093433-19d43eb8324a359b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2、环境配置
在Xcode中，选择你的工程设置项，选中“TARGETS”一栏，在“info”标签栏的“URL type“添加“URL scheme”为你所注册的应用程序id

![](http://upload-images.jianshu.io/upload_images/2093433-3693b1bff95bf928.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

三、配置plist文件

![](http://upload-images.jianshu.io/upload_images/2093433-68018905c5bf8acf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1、iOS9为了增强数据访问安全，将所有的http请求都改为了https，为了能够在iOS9中正常使用地图SDK，请在"Info.plist"中进行如下配置，否则影响SDK的使用。
```
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>

```
2、在iOS9中为了能正常调起微信支付的功能，必须在"Info.plist"中将微信的URL scheme列为白名单，否则无法调起，配置如下：
```
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>weixin</string>
</array>
```

四、简单使用

1、重写AppDelegate的openURL方法：
```
#import "WXPay.h"

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options
{
  return [[WXPay shareInstance] handleOpenURL: url];
}
```
2、js文件
```
//index.ios.js
import React, { Component } from 'react';
// import { NativeModules } from 'react-native';
// var WXPay = NativeModules.WXPay;
import WXPay from 'react-native-wxpay';

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
  componentDidMount() {
        this.registerApp();
        NativeAppEventEmitter.addListener(
            'finishedPay',
            (response) => {
                if (parseInt(response.errCode) === 0) {
                    alert('支付成功');
                }else if (parseInt(response.errCode) === -2){
                    alert('用户取消');
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
        WXPay.pay({
            'timestamp': '1412000000',
            'partnerid': '1900000109',
            'prepayid': 'WX1217752501201407033233368018',
            'noncestr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
            'package': 'Sign=WXPay',
            'sign': 'C380BEC2BFD727A4B6845133519F3AD6'
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

```
