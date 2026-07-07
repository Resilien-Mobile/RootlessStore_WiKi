---
title: CodeBrick 的玩法大全
description: 从快速脚本、快捷磁贴到插件原型，介绍 CodeBrick 在 Rootless Store 中的常见使用方式。
---

# CodeBrick 的玩法大全

CodeBrick 的核心价值，不是让你从第一天就写一个完整插件，而是先把一段 Shell 想法保存下来、跑起来、复用起来。

当它只是偶尔使用时，它可以是一个可保存的命令片段。  
当它变成高频动作时，它可以绑定到系统快捷磁贴。  
当它逐渐稳定，并且需要版本、包结构和分发方式时，它就可以进一步沉淀成 Plugin。

## 保存常用 Shell 片段

最基础的玩法，是把自己反复使用的 Shell 内容保存成一个 CodeBrick。

这适合一些短小但高频的操作，例如：

- 临时查看设备状态。
- 执行一次维护命令。
- 保存调试过程中经常使用的命令。
- 把一段个人脚本变成可点击的入口。

相比每次打开 Shell 页面重新输入，CodeBrick 更适合保存那些“不是每天都写，但经常会用”的命令。

## 绑定 Tile，点击即可执行

如果某个 CodeBrick 是高频动作，就可以绑定到系统快捷磁贴。

绑定后，用户不需要进入 Rootless Store，也不需要打开 Shell 页面，只要下拉系统快捷设置并点击对应 Tile，就可以直接执行这段脚本。

这类玩法适合一些明确、短小、结果可预期的动作，例如：

- 一键触发清理脚本。
- 一键执行设备维护命令。
- 一键运行常用检测命令。
- 一键切换某个个人使用状态。

Tile 绑定更适合“点一下就执行”的动作。如果一段脚本需要大量交互、需要长时间观察输出，或者执行前需要频繁修改参数，那么它通常不适合作为 Tile 入口。

## 用 Token 快速导入

CodeBrick 也可以通过 Token 文本快速导入。这里的 Token，本质上是一段符合 CodeBrick 接口的合法 JSON 文本。

这种方式适合在不同设备之间迁移简单脚本，或者从别人那里复制一段已经整理好的 CodeBrick 配置。

当前 CodeBrick Token 的结构可以先理解为：

```kotlin
data class JsonCodeBrickConfig(
    // CodeBrick 的名称。
    val codeBrickTitle: String,

    // CodeBrick 的执行上下文。
    // 当前可用值为：LIMITED、PERMISSIVE、ADB、ROOTD
    val codeBrickEnvironment: HosterOverallStatus,

    // 实际执行的 Shell 内容。
    val codeBrickContent: String
)

enum class HosterOverallStatus {
    LIMITED, PERMISSIVE, ADB, ROOTD
}
```

一个 CodeBrick Token 通常描述三件事：

- `codeBrickTitle`：CodeBrick 的名称。
- `codeBrickEnvironment`：执行上下文。
- `codeBrickContent`：实际执行的 Shell 内容。

示例：

```json
{
  "codeBrickTitle": "Check User",
  "codeBrickEnvironment": "LIMITED",
  "codeBrickContent": "whoami"
}
```

## 稳定后转换成 Plugin

CodeBrick 适合快速试验和个人使用。它的优势是轻、快、直接。

但当一段脚本开始具备下面这些特征时，就应该考虑把它转换成 Plugin：

- 需要明确版本。
- 需要更清晰的包结构。
- 需要附带更多文件。
- 需要给其他用户安装和使用。
- 需要更正式的描述、入口和运行模型。

可以简单理解为：CodeBrick 用来快速验证一个想法，Plugin 用来正式沉淀一个能力。

## 想探索更多 Bricks？

如果你想了解更多可以直接参考、改造或复用的 CodeBrick 示例，可以继续阅读下一章：CodeBrick Gallery。
