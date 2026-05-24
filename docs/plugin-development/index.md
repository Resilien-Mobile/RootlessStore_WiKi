---
title: 关于插件开发的细节
description: Rootless Store 的插件开发框架总览，分为 Plugin、Environment 与 Server 三个层面。
---

# 关于插件开发的细节

这一部分文档，不再讨论 Rootless Store 为什么存在，而是开始进入真正的插件开发框架。

目前整个框架会分成三个层面：

## 1. Plugin 层面

这里讨论的是运行时插件，也就是实际安装到 Rootless Store 本地、由运行器直接管理和执行的插件。

这类 Plugin 关心的是：

- 如何被安装、显示、启动、停止和删除。
- 如何声明插件入口、包名、唯一 ID 与 `requiredEnvironment` 条件。
- 如何在 GUI 环境下被用户理解、执行和调试。
- 如何 **“借力”** 使用已启用的 Environment 包所提供的运行时、二进制工具和环境变量 (Beta)
- 如何在不破坏宿主机边界的前提下稳定执行自己的功能。

当前已经先完成这一部分的第一版说明：

- [Plugin：运行时插件](/plugin-development/client-runtime-plugin)

## 2. Environment 层面

这里讨论的是 Environment 包，也就是实际安装到 Rootless Store 本地、为插件和 Shell 执行提供环境与运行时能力的包。  
Environment 相比于 Plugin ，会更加偏 **能力提供** 而非 **做什么、怎么做**

这类 Environment 包关心的是：

- 如何被安装、启用、禁用和删除。
- 如何声明环境包入口、运行时路径、动态库路径与环境变量。
- 如何提供 Python、BusyBox、Node.js、二进制工具链等可被插件复用的运行时能力。
- 如何把可执行二进制文件、脚本和依赖库组织进 Environment 包，并在执行时被 `PATH`、`LD_LIBRARY_PATH` 和 `env` 正确引用。
- 如何在不破坏宿主机边界的前提下，为插件执行和 Shell 执行提供稳定的运行环境。

当前已经先完成这一部分的第一版说明：

- [Environment：运行时环境包](/plugin-development/environment-runtime-package)

Environment 和 Plugin 是平级且相辅相成的关系：Plugin 负责表达具体能力和执行入口，Environment 负责提供这些能力运行时可能依赖的工具链、解释器、动态库和环境变量。

## 3. Server 层面

这里讨论的不是本地运行时插件，而是和 Sources、后端接口、第三方源能力相关的服务端侧插件或扩展结构


- [Server：Sources 与后端框架](/plugin-development/server-sources-backend)


## 当前立场

插件开发这件事，在 Rootless Store 里不会被定义成“随便丢一个脚本就算接入”。无论是 Plugin、Environment 还是 Server，最终都要服务于同一件事：

- 把能力边界讲清楚。
- 把入口约定讲清楚。
- 把执行行为讲清楚。
- 把维护成本控制住。

只有这样，插件生态才不会从第一天开始就失控。
