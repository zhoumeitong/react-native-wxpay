//
//  WXPay.m
//  WXPay
//
//  Created by zmt on 16/7/18.
//  Copyright © 2016年 cn.com.jiuqi. All rights reserved.
//

#import "WXPay.h"
#import "RCTLog.h"
#import "RCTEventDispatcher.h"

static WXPay * instance = nil;

@implementation WXPay

//此处不能使用OC的字符串，直接输入就行了或什么都不输
//RCT_EXPORT_MODULE(WXPay);
RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

+ (instancetype)shareInstance {
    @synchronized(self) {
        if (!instance) {
            instance = [[self alloc] init];
        }
    }
    return instance;
}

+ (instancetype)allocWithZone:(NSZone *)zone {
    @synchronized(self) {
        if (!instance) {
            instance = [super allocWithZone:zone];
        }
    }
    return instance;
}

- (instancetype)copyWithZone:(NSZone *)zone {
    return self;
}

// 处理微信通过URL启动App时传递的数据
- (BOOL)handleOpenURL:(NSURL *)url
{
    return [WXApi handleOpenURL:url delegate:instance];
}


// 发送一个sendReq后，收到微信的回应
- (void)onResp:(BaseResp *)resp {
    
   if([resp isKindOfClass:[PayResp class]]){
        //支付返回结果，实际支付结果需要去微信服务器端查询
        NSString *strMsg = [NSString stringWithFormat:@"支付结果"];
        NSString *errCode = @"";
        NSMutableDictionary *body = [[NSMutableDictionary alloc] initWithObjectsAndKeys:
                                     strMsg,@"strMsg",
                                     errCode,@"errCode",nil];
        switch (resp.errCode) {
            case WXSuccess:
                errCode = [NSString stringWithFormat:@"%d",resp.errCode];
                strMsg = @"支付结果：成功！";
                body[@"strMsg"] = strMsg;
                body[@"errCode"] = errCode;
//                NSLog(@"支付成功－PaySuccess，retcode = %d", resp.errCode);
                break;
                
            case WXErrCodeUserCancel:
                errCode = [NSString stringWithFormat:@"%d",resp.errCode];
                strMsg = @"支付结果：用户取消";
                body[@"strMsg"] = strMsg;
                body[@"errCode"] = errCode;
//                NSLog(@"用户取消－UserCancel，retcode = %d", resp.errCode);
                break;
                
            default:
                errCode = [NSString stringWithFormat:@"%d",resp.errCode];
                strMsg = [NSString stringWithFormat:@"支付结果：失败！retcode = %d, retstr = %@", resp.errCode,resp.errStr];
                body[@"strMsg"] = strMsg;
                body[@"errCode"] = errCode;
//                NSLog(@"错误，retcode = %d, retstr = %@", resp.errCode,resp.errStr);
                break;
        }
        [instance.bridge.eventDispatcher sendAppEventWithName:@"finishedPay"
                                                         body:body];
        
    }
    
}

// 收到一个来自微信的请求，
// 第三方应用程序处理完后调用sendResp向微信发送结果
- (void)onReq:(BaseReq *)req {
}


// 向微信终端程序注册第三方应用
RCT_EXPORT_METHOD(registerApp:(NSString *)appid
                  :(RCTResponseSenderBlock)callback)
{
    BOOL res = [WXApi registerApp:appid];
    callback(@[@(res)]);
}


// 判断当前微信的版本是否支持OpenApi
RCT_EXPORT_METHOD(isWXAppSupportApi:(RCTResponseSenderBlock)callback) {
    // 回到主线程
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL res = [WXApi isWXAppSupportApi];
        callback(@[@(res)]);
    });
}

// 判断当前微信的版本是否支持该插件
RCT_EXPORT_METHOD(isWXAppSupport:(RCTResponseSenderBlock)callback) {
    // 回到主线程
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL res = [WXApi isWXAppSupportApi];
        callback(@[@(res)]);
    });
}


// 检测是否已安装微信
RCT_EXPORT_METHOD(isWXAppInstalled:(RCTResponseSenderBlock)callback)
{
    // 回到主线程
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL res = [WXApi isWXAppInstalled];
        callback(@[@(res)]);
    });
}

// 获取当前微信SDK的版本号
RCT_EXPORT_METHOD(getApiVersion:(RCTResponseSenderBlock)callback) {
    NSString* res = [WXApi getApiVersion];
    callback(@[res]);
}

// 获取微信的itunes安装地址
RCT_EXPORT_METHOD(getWXAppInstallUrl:(RCTResponseSenderBlock)callback) {
    NSString* res = [WXApi getWXAppInstallUrl];
    callback(@[res]);
}

// 打开微信
RCT_EXPORT_METHOD(openWXApp:(RCTResponseSenderBlock)callback) {
    // 回到主线程
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL res = [WXApi openWXApp];
        callback(@[@(res)]);
    });
}

// 发起认证请求
RCT_EXPORT_METHOD(sendAuthReq:(NSString *)scope
                  :(NSString *)state
                  :(RCTResponseSenderBlock)callback) {
    SendAuthReq* req = [[SendAuthReq alloc] init];
    req.scope = scope;
    req.state = state;
    BOOL res = [WXApi sendReq:req];
    callback(@[@(res)]);
}


RCT_EXPORT_METHOD(pay:(NSDictionary *)dict
                  :(RCTResponseSenderBlock)callback) {
    NSMutableString *stamp  = [dict objectForKey:@"timestamp"];
    PayReq* req = [[PayReq alloc] init];
    req.partnerId = [dict objectForKey:@"partnerid"];
    req.prepayId = [dict objectForKey:@"prepayid"];
    req.nonceStr = [dict objectForKey:@"noncestr"];
    req.timeStamp = stamp.intValue;
    req.package = [dict objectForKey:@"package"];
    req.sign = [dict objectForKey:@"sign"];
    //日志输出
//    NSLog(@"partid=%@\nprepayid=%@\nnoncestr=%@\ntimestamp=%ld\npackage=%@\nsign=%@",req.partnerId,req.prepayId,req.nonceStr,(long)req.timeStamp,req.package,req.sign );
    // 回到主线程
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL res = [WXApi sendReq:req];
        callback(@[@(res)]);
    });
}
@end
