---
title: 什么是 CodeBrick
description: CodeBrick 是 Rootless Store 中用于保存、复用和快速触发 Shell 操作的轻量脚本单元。
---

# 什么是 CodeBrick

CodeBrick 是 Rootless Store 内置的轻量脚本单元，用来把一段 Shell 能力保存下来、快速执行、反复复用，并在需要时沉淀成正式 Plugin。

它面向的是那些还没有必要被打包成完整插件，但又值得被保存、复用和快速触发的 Shell 操作。你可以把 CodeBrick 理解成“可保存的命令片段”：它比临时 Shell 输入更稳定，比完整 Plugin 更轻量。

## CodeBrick 包含什么

一个 CodeBrick 通常由几部分组成：

- 一个便于识别的名称。
- 一段实际执行的 Shell 内容。
- 一个执行上下文，例如 App Shell、ADB Shell 或 Root Shell。
- 一个可选的系统快捷磁贴（Tile）绑定。

## 为什么需要 CodeBrick

CodeBrick 适合承载一些高频、短小、个人化的操作，例如状态切换、快速清理、触发脚本或执行一次设备维护命令。

更重要的是，CodeBrick 可以绑定系统快捷磁贴。绑定后，用户不需要进入 Rootless Store，也不需要打开 Shell 页面，只要从系统快捷设置中点击对应 Tile，就可以直接执行这段脚本。

## 和 Plugin 的关系

CodeBrick 不是 Plugin 的替代品，也不是一种新的插件包格式。它更像是临时 Shell 输入和正式 Plugin 之间的轻量入口。

当一段 CodeBrick 逐渐稳定，并且开始需要更明确的版本、入口、包结构和分发方式时，它就应该被转换成 Plugin。

可以简单理解为：CodeBrick 用来快速保存和触发一个脚本想法，Plugin 用来正式沉淀一个能力，Environment 用来提供这个能力运行时依赖的工具链。
