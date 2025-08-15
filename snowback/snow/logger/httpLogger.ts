import { Request, Response, NextFunction, Router } from 'express';
import Logger from '.';

export const requestLog = (request: Request, className: string, methodName: string) => {
//   const logMsg = `\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<${request.url}响应开始<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//   当前类名: ${className}
//   当前方法名: ${methodName}
//   当前请求: ${request.method} - ${request.url}
//   IP: ${request.ip}
//   当前Params参数: ${JSON.stringify(request.params)}
//   当前Query参数: ${JSON.stringify(request.query)}
//   当前请求体: ${JSON.stringify(request.body)}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<${request.url}响应开始<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;

//   Logger.info(logMsg);
  return Date.now();
};

export const resopseLog = (request: Request, data: any, startTime: number) => {
//   const logMsg = `\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<${request.url}响应结束<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//   当前请求: ${request.method} - ${request.url}
//   IP: ${request.ip}
//   当前用户: 'coderixe'
//   响应时间：${Date.now() - startTime}ms
//   当前响应体: ${JSON.stringify(data)}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<${request.url}响应结束<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
//   Logger.info(logMsg);
};

export const errorLog = (request: Request, error: Error) => {
//   const logMsg = `\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//   错误信息: ${error || 'system error'}
//   请求路径: ${request.originalUrl}
//   请求方法: ${request.method}
//   IP: ${request.ip}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
//   Logger.error(logMsg);
  console.log(error);
};
