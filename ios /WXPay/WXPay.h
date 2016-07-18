//
//  WXPay.h
//  WXPay
//
//  Created by zmt on 16/7/18.
//  Copyright © 2016年 cn.com.jiuqi. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "WXApi.h"

@interface WXPay : NSObject <RCTBridgeModule,WXApiDelegate>

@end
