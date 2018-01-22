# react-native-wxpay

### 功能：
通过微信SDK(v1.8.2)实现微信支付功能

### 使用步骤：

#### 一、链接WXPay库

参考：https://reactnative.cn/docs/0.50/linking-libraries-ios.html#content

##### 手动添加：
1、添加react-native-wxpay插件到你工程的node_modules文件夹下

2、添加AMap库中的.xcodeproj文件在你的工程中

3、点击你的主工程文件，选择Build Phases，然后把刚才所添加进去的.xcodeproj下的Products文件夹中的静态库文件（.a文件），拖到Link Binary With Libraries组内。

##### 自动添加：
```
npm install react-native-wxpay --save
或
yarn add react-native-wxpay

react-native link
```

由于AppDelegate中使用WXPay库，所以我们需要打开你的工程文件，选择Build Settings，然后搜索Header Search Paths，然后添加库所在的目录 `$(SRCROOT)/../node_modules/react-native-wxpay/ios/WXPay`


#### 二、开发环境配置

参考：https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=1417694084&token=&lang=zh_CN

1、引入系统库
左侧目录中选中工程名，在TARGETS->Build Phases-> Link Binary With Libaries中点击“+”按钮，在弹出的窗口中查找并选择如下所需的库，单击“Add”按钮，将库文件添加到工程中。

- SystemConfiguration.framework
- libz.dylib
- libsqlite3.0.dylib
- libc++.dylib
- Security.framework
- CoreTelephony.framework
- CFNetwork.framework

如图所示：

![](http://upload-images.jianshu.io/upload_images/2093433-56088c5af2abdec5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


2、环境配置
在Xcode中，选择你的工程设置项，选中“TARGETS”一栏，在“info”标签栏的“URL type“添加“URL scheme”为你所注册的应用程序id

![](http://upload-images.jianshu.io/upload_images/2093433-3693b1bff95bf928.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在工程文件中选择Build Setting，在"Other Linker Flags"中加入"-Objc -all_load"

![](http://upload-images.jianshu.io/upload_images/2093433-8f42a230dcc58456.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 三、配置plist文件

![](http://upload-images.jianshu.io/upload_images/2093433-2d1868511e3a3ee4.jpeg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在iOS9中为了能正常调起微信支付的功能，必须在"Info.plist"中将微信的URL scheme列为白名单，否则无法调起，配置如下：
```
<key>LSApplicationQueriesSchemes</key>
<array>
<string>weixin</string>
</array>
```

#### 四、简单使用

1、重写AppDelegate的openURL方法：
```
#import "WXPay.h"

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
if ([sourceApplication isEqualToString:@"com.tencent.xin"]) {
return [[WXPay shareInstance] handleOpenURL: url];
}else{
return NO;
}
}


// NOTE: 9.0以后使用新API接口
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
if ([options[@"UIApplicationOpenURLOptionsSourceApplicationKey"]  isEqualToString:@"com.tencent.xin"]) {
return [[WXPay shareInstance] handleOpenURL: url];
}else{
return NO;
}
}
```
2、js文件
```
//index.ios.js
import React, { Component } from 'react';
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

import WXPay from 'react-native-wxpay';

let appid = 'wxd930ea5d5a258f4f';

function show(title, msg) {
AlertIOS.alert(title+'', msg+'');
}

export default class TextReactNative extends Component {
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
```

