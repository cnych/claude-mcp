---
title: 使用 MCP Feedback Enhanced 让 Cursor 500 次额度膨胀 N 倍
excerpt: mcp-feedback-enhanced 是一个通过引导 AI 与用户确认而非进行推测性操作，可将多个工具调用整合为单个面向反馈的请求，大幅降低平台成本并提升开发效率的 MCP 服务器。
date: 2025-06-11
slug: cursor-mcp-feedback-enhanced
coverImage: https://static.claudemcp.com/images/blog/mcp-feedback-enhanced.jpg
featured: true
author:
  name: AI进修生
  avatar: https://static.claudemcp.com/images/avatars/Aitrainee.png
category: cursor
---

**一个让 Cursor "无限续杯"的咒语，专治额度焦虑**

> 本文摘自微信公众账号：**AI 进修生**。

Cursor 的请求次数，一直是很多人心里的痛。

一个月 500 次，听着不少，但真要干起活来，修个 bug、搞个复杂功能，几轮对话下来，额度就告急了。

就像网友 Ryo 吐槽的，145 块钱，问一次 3 毛，用起来肉疼。

![Ryo 网友吐槽 Cursor 费用](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-1.webp)

然后，网友 ultrasev 分享了个很有意思的技巧，或者说，一个"咒语"。

![ultrasev 分享的技巧](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-2.webp)

他在提示词里加了这么一段：

"... 每次你觉得你修好了，你就在终端里询问我是否满意 ( read -P "修复完成，是否满意？(y/n) " response && echo $response ) ，直到我回复 yes，你才能退出，如果我不回复或者回复其他的，请继续修复，重复上面过程直到你读取到 yes，这一点非常重要。"

这其实是利用了 Cursor 的 tool calling (工具调用) 功能。

这等于把一条请求，掰成了多条来用。

AI 不再是闷头干完活就交差，而是每干一步，就通过终端工具停下来，问你一句"搞定了，满意不？"

你不点头说 'y'，它就得接着改。

但即便如此，对于那些复杂点的任务，这已经足够让你在一次请求的额度里，跟 AI 反复拉扯，直到把问题彻底搞定。

算是个相当实用的省钱小妙招了。

不过现在有人把这个小需求做成了一个 mcp 工具。

你跟 Cursor 聊一次，就算一次请求。可往往一个需求，得来来回回聊好几轮才能搞定，这样下来，一次计费就变成了 n 次计费，有点划不来。mcp-feedback-enhanced MCP 服务器

开源地址在这：https://github.com/Minidoracat/mcp-feedback-enhanced

简单说，它能把好几次来回的交互，合并到一次请求里。

你提个需求，Cursor 干活，然后通过这个 MCP 问你反馈，你给反馈，它再接着改，整个过程都在一轮对话里，不额外计费。

支持平台： Cursor | Cline | Windsurf | Augment | Trae

## 试用效果演示

我们来试一下它的效果。

我们按照正常对话给他提需求。或者你告诉他，我需要测试  mcp-feedback-enhanced MCP

![MCP 测试效果](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-3.webp)

他第 1 个需求解决完之后会调用这个 mcp，然后会打开一个 GUI 窗口，可以输入文字。

![](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-4.webp)

他得到你这个反馈之后会进行解答，解答完了之后再弹出这个窗口，以此往复。。

![GUI 交互窗口](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-5.webp)

用这种方式我们就可以一次请求多次对话。你看我最终的对话，好长好长。

![长对话展示](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-6.gif)

不过，Cursor agent 最多能连续调用 25 次工具。超过这个数，就得算一次新请求了。

![25次工具调用限制](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-7.webp)

我记得以前写过那种让 AI 主动思考的提示词。很多时候他一次对话就能把 Cursor 25 次工具调用用完。

## GUI 界面介绍

下面看一下这个 mcp 的使用。我还得给你介绍一下他打开的这个 gui。

主要用的就是这张图里介绍的：

![MCP 使用界面](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-10.webp)

这个摘要是他总结 Cursor 对话 AI 的摘要你不用管。只是做个显示作用。

![对话摘要界面](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-11.webp)

同样的，这个命令界面也是显示作用。

![命令界面](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-12.webp)

这个设置里面呢，同样也是一些排版相关的，也不是什么太重要的。

![设置界面](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-13.webp)

所以这个 mcp 使用起来很简单。

不过需要注意的是，它是可以用 web 和 qt 两种界面来交互的。

![Web 和 QT 界面](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-14.webp)

这个 qt 界面有问题的话。提醒 agent 修复

![QT 界面问题修复](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-15.webp)

## MCP 安装配置指南

那么我们介绍一下今天这个 mcp 的安装吧。

以前我很多文章介绍了不同的 mcp。有些 mcp 安装起来其实和大多数的比较起来复杂一些。比如今天这个就用到了一个 gui。

Win             配置              完成安装流程 Windows 环境最难安装

我们先看 windows 上怎么安装，这个平台上 mcp 最难安装的。

怎么说，还是和以前介绍的方法一样:

把这个 mcp-feedback-enhanced mcp 的 Readme 文档（Github 下）和我以前写的这个实践: [Windows 下 MCP 报错的救星来了，1 分钟教你完美解决 Cursor 配置问题。](https://mp.weixin.qq.com/s?__biz=MzkyMzY1NTM0Mw==&mid=2247501961&idx=1&sn=70d538d8db272b2d317841887cdeeca6&scene=21#wechat_redirect)。

![安装文档](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-16.png)

官方文档是用 uv 安装。我执行的时候 Cursor Agent 没有安装好 uv，然后他转头就用本地 Python 解释器：`C:\Python312\python.exe`  安装了。

最后配置文件是这样的。

![配置文件](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-17.webp)

mac linux 呢，你直接按照他的官方文档做就行。如果你不会安装 uv 这些，直接把官方文档丢给 Cursor Agent，

![官方文档](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-18.webp)

## 持续调用优化配置

MCP 持续调用

为了让这个 MCP 被持续调用，以达到最佳效果。

有些提示词需要设置一下。

```bash
# MCP Interactive Feedback 规则

1. 在任何流程、任务、对话进行时，无论是询问、回复、或完成阶段性任务，皆必须调用 MCP mcp-feedback-enhanced。

2. 每当收到用户反馈，若反馈内容非空，必须再次调用 MCP mcp-feedback-enhanced，并根据反馈内容调整行为。

3. 仅当用户明确表示「结束」或「不再需要交互」时，才可停止调用 MCP mcp-feedback-enhanced，流程才算结束。

4. 除非收到结束指令，否则所有步骤都必须重复调用 MCP mcp-feedback-enhanced。

5. 完成任务前，必须使用 MCP mcp-feedback-enhanced 工具向用户询问反馈。
```

放到设置规则里。

![设置规则](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-19.webp)

或者放到项目规则里

![项目规则](https://static.claudemcp.com/images/blog/mcp-feedback-enhanced-20.webp)

配置完成。
