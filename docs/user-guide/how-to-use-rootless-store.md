---
title: 如何正确使用 Rootless Store
description: 面向用户的 Rootless Store 使用路径、核心概念与基础判断方式。
---

# 如何正确使用 Rootless Store

Rootless Store 不是传统意义上的应用商店。它更像一个本地能力入口：你可以添加 Sources，安装 Plugin 和 Environment，执行脚本，也可以用 CodeBrick 保存自己的轻量操作。

第一次使用时，不需要马上理解所有页面和字段。更重要的是先建立一条基本路径：先看设备状态，再准备运行环境，然后安装和执行能力。

## 第一次打开应该先看什么

第一次打开 Rootless Store，可以先从 Home 页面开始。

Home 页面不是单纯的入口页，而是设备状态看板。它会帮助你理解当前设备大概处在什么执行环境里，例如普通 App Shell、ADB / Shizuku、Root 等。

如果你只是普通使用，不需要一开始就理解所有状态。可以先记住一个原则：权限越高，能执行的能力越多，但风险也越高。

当你准备运行更高权限的插件或脚本时，再回到这里确认当前设备状态是否满足要求。

## 想安装能力：先理解 Plugin 和 Environment

Rootless Store 中有两个很重要的本地模块：Plugin 和 Environment。

Plugin 负责表达“要做什么”。  
Environment 负责提供“让它怎么跑”的运行条件。

例如，一个 Plugin 可能只是调用 `python3 main.py`。真正提供 Python 解释器和相关库的，不一定是 Plugin 自己，而可能是一个已经安装并启用的 Environment。

所以安装插件时，可以先问自己三件事：

- 这个 Plugin 能不能独立运行？
- 它是否依赖某个 Environment？
- 它声明的宿主环境要求，当前设备是否满足？

如果插件运行失败，不一定是插件本身坏了，也可能是缺少 Environment、权限不足，或者当前执行上下文不符合它的要求。

## 从 Sources 和 Market 获取内容

Sources 是内容来源。

添加 Source 后，可以进入对应 Market，浏览可安装的 Plugin 和 Environment。你可以把 Source 理解成“这个 Market 的入口和身份信息”，把 Market 理解成“这个来源实际展示内容的地方”。

如果你不是从 Market 安装，而是手动导入本地 ZIP，那么这个内容会更接近 Local 来源。Local 内容不代表不好，但你需要更清楚它来自哪里、是否可信、是否适合当前设备。

在使用第三方 Source 或本地 ZIP 前，建议先确认它的来源、说明和权限要求。Rootless Store 能提供管理入口，但不能替你判断每一段外部脚本是否安全。

## 运行 Plugin

Plugin 页面用于查看、启动、停止和删除已经安装的插件。

不同 Plugin 的运行方式可能不同：

- 一次性插件更像“点击执行一次”。
- 常驻类插件更像“打开一个开关，让它持续运行”。

如果插件执行失败，优先检查三件事：

- 当前设备环境是否满足插件要求。
- 插件依赖的 Environment 是否已经安装并启用。
- 插件入口和执行权限是否正确。

如果一个插件依赖 ADB、Shizuku 或 Root 能力，而当前设备没有准备好对应环境，那么它很可能无法按预期运行。

## 用 CodeBrick 保存轻量操作

如果你只是想保存一段 Shell 命令，不一定需要写完整 Plugin。

CodeBrick 适合保存短小、高频、个人化的操作。它可以直接执行，也可以绑定系统快捷磁贴。绑定后，只要点击 Tile，就能触发对应脚本。

你可以把 CodeBrick 理解成“可保存的命令片段”。它比临时 Shell 输入更稳定，比完整 Plugin 更轻量。

当一个 CodeBrick 变得稳定，并且开始需要版本、包结构或分发能力时，再考虑把它转换成 Plugin。

## 用 Shell 做临时调试

Shell 更适合临时输入命令、验证环境、排查问题。

如果一段命令只是临时尝试，可以先放在 Shell 里执行。  
如果一段命令会反复使用，可以保存成 CodeBrick。  
如果一段能力需要分享给别人，或者需要长期维护，就更适合做成 Plugin。

Shell、CodeBrick 和 Plugin 不是互相替代的关系，而是不同阶段的工具：

- Shell 用来临时验证。
- CodeBrick 用来保存和快速触发。
- Plugin 用来正式沉淀和分发。

## 常见问题

### 插件为什么不能运行？

通常是环境不满足、权限不足、入口错误，或者依赖的 Environment 没有安装和启用。

可以先检查插件声明的 `requiredEnvironment`，再检查当前设备状态和 Environment 状态。

### 为什么同一条命令在不同地方结果不同？

因为 App Shell、ADB Shell、Root Shell 的权限和上下文不同。

同一条命令在普通应用上下文、ADB 上下文和 Root 上下文中，可能访问到不同文件、拥有不同权限，也可能返回不同结果。

### 什么时候应该用 CodeBrick，什么时候应该用 Plugin？

临时、个人、高频的小操作，适合用 CodeBrick。  
稳定、可分发、需要版本管理和包结构的能力，适合做成 Plugin。

### Environment 一定要安装吗？

不一定。

如果插件或脚本只依赖系统自带命令，可能不需要额外 Environment。  
如果它依赖 Python、BusyBox、Node.js 或其他工具链，就可能需要先安装并启用对应 Environment。

### 本地 ZIP 可以直接安装吗？

可以，但要谨慎。

本地 ZIP 更依赖你自己判断来源和内容。安装前最好确认它的 Manifest、入口文件、权限要求和实际来源。
