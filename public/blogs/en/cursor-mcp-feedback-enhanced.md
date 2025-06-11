---
title: Using MCP Feedback Enhanced to Multiply Cursor's 500 Quota by N Times
excerpt: mcp-feedback-enhanced is an MCP server that guides AI to confirm with users rather than making speculative operations, consolidating multiple tool calls into a single feedback-oriented request, significantly reducing platform costs while boosting development efficiency.
date: 2025-06-11
slug: cursor-mcp-feedback-enhanced
coverImage: /images/blog/mcp-feedback-enhanced.jpg
featured: true
author:
  name: AI进修生
  avatar: /images/avatars/Aitrainee.png
category: cursor
---

**A "Limitless Refill" Spell for Cursor, Specifically Targeting Quota Anxiety**

> This article is excerpted from the WeChat public account: **AI Apprentice**.

Cursor's request quota has always been a pain point for many users.

500 requests per month may sound generous, but when tackling tasks like debugging or implementing complex features, a few rounds of dialogue can quickly deplete the quota.

As user Ryo lamented, spending 145 yuan only to burn through 0.3 yuan per query feels painfully wasteful.

![User Ryo's complaint about Cursor costs](/images/blog/mcp-feedback-enhanced-1.webp)

Then, user ultrasev shared an intriguing technique—or rather, a "spell."

![ultrasev's shared tip](/images/blog/mcp-feedback-enhanced-2.webp)

He added this prompt:

"... Every time you think you've fixed it, ask me in the terminal if I'm satisfied (read -P 'Repair completed. Are you satisfied? (y/n) ' response && echo $response). Only exit after receiving 'yes.' If I don't reply or reply otherwise, continue repairing, repeating the process until you read 'yes.' This is critically important."

This cleverly leverages Cursor's tool calling feature.

Effectively, it stretches one request into multiple interactions.

Instead of completing the task silently, the AI pauses at each step via the terminal tool to ask, "Done. Happy with this?"

Unless you reply 'y,' it keeps refining.

Even for moderately complex tasks, this allows you to iterate within a single request quota until the issue is fully resolved.

A brilliant little cost-saving trick.

Now, someone has turned this idea into an MCP tool.

Each chat with Cursor counts as one request. But often, fulfilling a single requirement takes multiple back-and-forths, turning what should be one charge into n charges—hardly economical. Enter mcp-feedback-enhanced MCP server.

Find the open-source repo here: https://github.com/Minidoracat/mcp-feedback-enhanced

In short, it consolidates multiple interactions into one request.

You submit a request, Cursor works on it, then uses this MCP to solicit feedback. You provide input, it adjusts, all within a single dialogue—no extra charges.

Supported platforms: Cursor | Cline | Windsurf | Augment | Trae

## Demo of the Tool in Action

Let's test its effectiveness.

We'll make a normal request or explicitly state: "I need to test mcp-feedback-enhanced MCP."

![MCP test results](/images/blog/mcp-feedback-enhanced-3.webp)

After addressing the first requirement, it invokes the MCP, opening a GUI window for text input.

![](/images/blog/mcp-feedback-enhanced-4.webp)

Upon receiving feedback, it processes the response, then reopens the window—iterating as needed.

![GUI interaction window](/images/blog/mcp-feedback-enhanced-5.webp)

This way, one request fuels multiple exchanges. Observe the extended dialogue below.

![Extended dialogue showcase](/images/blog/mcp-feedback-enhanced-6.gif)

Note: Cursor Agent caps tool calls at 25 per session. Beyond that, a new request is triggered.

![25-tool-call limit](/images/blog/mcp-feedback-enhanced-7.webp)

I recall writing prompts that make AI "think actively." Often, a single dialogue exhausts all 25 tool calls.

## GUI Interface Overview

Here's how the MCP operates, focusing on this GUI:

![MCP interface](/images/blog/mcp-feedback-enhanced-10.webp)

The summary merely displays Cursor's dialogue recap—ignore it.

![Dialogue summary interface](/images/blog/mcp-feedback-enhanced-11.webp)

Similarly, the command panel is informational.

![Command interface](/images/blog/mcp-feedback-enhanced-12.webp)

Settings handle layout preferences—nothing critical.

![Settings interface](/images/blog/mcp-feedback-enhanced-13.webp)

Thus, the MCP is straightforward to use.

One caveat: It supports both web and QT interfaces.

![Web and QT interfaces](/images/blog/mcp-feedback-enhanced-14.webp)

If the QT interface malfunctions, prompt the Agent to fix it.

![QT interface troubleshooting](/images/blog/mcp-feedback-enhanced-15.webp)

## MCP Installation Guide

Now, let's install this MCP.

Past articles covered various MCPs—some installations are trickier. This one involves a GUI.

Win             Configuration       Complete setup (Windows is the most challenging)

First, Windows setup—the toughest platform.

Follow the same approach as before:

Review the mcp-feedback-enhanced README (on GitHub) alongside my earlier guide: [Windows MCP Error Savior: Fix Cursor Config Issues in 1 Minute.](https://mp.weixin.qq.com/s?__biz=MzkyMzY1NTM0Mw==&mid=2247501961&idx=1&sn=70d538d8db272b2d317841887cdeeca6&scene=21#wechat_redirect).

![Installation docs](/images/blog/mcp-feedback-enhanced-16.png)

The official docs recommend UV installation. When my Cursor Agent failed to install UV, it defaulted to the local Python interpreter: `C:\Python312\python.exe`.

Final config file:

![Config file](/images/blog/mcp-feedback-enhanced-17.webp)

For Mac/Linux, follow the official docs. If UV installation stumps you, feed the docs to Cursor Agent.

![Official documentation](/images/blog/mcp-feedback-enhanced-18.webp)

## Optimizing Continuous Calls

To maximize MCP's iterative potential, tweak these prompts:

```bash
# MCP Interactive Feedback Rules

1. During any process, task, or dialogue—whether querying, replying, or completing a milestone—always invoke MCP mcp-feedback-enhanced.

2. Upon receiving user feedback (if non-empty), recall MCP mcp-feedback-enhanced and adapt behavior accordingly.

3. Only cease MCP calls when the user explicitly states "end" or "no further interaction needed," marking process completion.

4. Unless terminated, all steps must repeatedly invoke MCP mcp-feedback-enhanced.

5. Before task completion, solicit feedback via MCP mcp-feedback-enhanced.
```

Add to settings rules:

![Settings rules](/images/blog/mcp-feedback-enhanced-19.webp)

Or project rules:

![Project rules](/images/blog/mcp-feedback-enhanced-20.webp)

Configuration complete.
