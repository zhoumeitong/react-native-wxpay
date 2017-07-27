//
//  WXPay.h
//  WXPay
//
//  Created by zmt on 16/7/18.
//  Copyright © 2016年 cn.com.jiuqi. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif
#import "WXApi.h"

@interface WXPay : NSObject <RCTBridgeModule,WXApiDelegate>

+(instancetype)shareInstance;

- (BOOL) handleOpenURL:(NSURL *)url;

@end
