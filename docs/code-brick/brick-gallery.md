---
title: CodeBrick Gallery
description: 一些可能的 CodeBrick Token JSON 示例，用于参考、改造和快速导入。
---

# CodeBrick Gallery

这是一些可能的 CodeBrick Tokens，不一定符合你的机型和期望功能，执行前务必谨慎小心。

如果你有好的想法，也想一起分享，非常欢迎通过此页面底部的 Edit 超链接修改内容，并提交 PR。

这些示例更适合作为参考和改造起点，而不是直接无脑执行的固定答案。不同 Android 版本、不同 ROM、不同权限状态下，同一段 Shell 内容可能会得到不同结果。

## 查看当前执行用户 <Badge type="tip" text="LIMITED" />

```json
{
  "codeBrickTitle": "Check User",
  "codeBrickEnvironment": "LIMITED",
  "codeBrickContent": "whoami"
}
```

## 查看当前目录 <Badge type="tip" text="LIMITED" />

```json
{
  "codeBrickTitle": "Print Working Directory",
  "codeBrickEnvironment": "LIMITED",
  "codeBrickContent": "pwd"
}
```

## 查看下载目录 <Badge type="tip" text="LIMITED" />

```json
{
  "codeBrickTitle": "List Download Directory",
  "codeBrickEnvironment": "LIMITED",
  "codeBrickContent": "ls -la /sdcard/Download"
}
```

## 查看系统时间 <Badge type="tip" text="LIMITED" />

```json
{
  "codeBrickTitle": "Show Date",
  "codeBrickEnvironment": "LIMITED",
  "codeBrickContent": "date"
}
```

## 查看电池信息 <Badge type="warning" text="ADB" />

```json
{
  "codeBrickTitle": "Dump Battery Info",
  "codeBrickEnvironment": "ADB",
  "codeBrickContent": "dumpsys battery"
}
```

## 查看已安装包数量 <Badge type="warning" text="ADB" />

```json
{
  "codeBrickTitle": "Count Packages",
  "codeBrickEnvironment": "ADB",
  "codeBrickContent": "pm list packages | wc -l"
}
```

## 查看 SELinux 状态 <Badge type="danger" text="ROOTD" />

```json
{
  "codeBrickTitle": "Check SELinux",
  "codeBrickEnvironment": "ROOTD",
  "codeBrickContent": "getenforce"
}
```

## 查看磁盘占用 <Badge type="danger" text="ROOTD" />

```json
{
  "codeBrickTitle": "Disk Usage",
  "codeBrickEnvironment": "ROOTD",
  "codeBrickContent": "df -h"
}
```

## 切换到静音模式 <Badge type="warning" text="ADB" />

```json
{
  "codeBrickTitle": "Silent Mode",
  "codeBrickEnvironment": "ADB",
  "codeBrickContent": "cmd audio set-ringer-mode SILENT"
}
```

## 切换到震动模式 <Badge type="warning" text="ADB" />

```json
{
  "codeBrickTitle": "Vibrate Mode",
  "codeBrickEnvironment": "ADB",
  "codeBrickContent": "cmd audio set-ringer-mode VIBRATE"
}
```

## 切换到常规模式 <Badge type="warning" text="ADB" />

```json
{
  "codeBrickTitle": "Normal Mode",
  "codeBrickEnvironment": "ADB",
  "codeBrickContent": "cmd audio set-ringer-mode NORMAL"
}
```

## 激活 Scene <Badge type="warning" text="ADB" />

```json
{
  "codeBrickTitle": "Active Scene",
  "codeBrickEnvironment": "ADB",
  "codeBrickContent": "sh /storage/emulated/0/Android/data/com.omarea.vtools/up.sh"
}
```
