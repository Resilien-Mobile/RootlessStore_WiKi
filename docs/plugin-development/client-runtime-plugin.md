---
title: Client：运行时插件
description: Rootless Store 在 client 层面对运行时插件的基本要求与开发思路。
---

# Client：运行时插件

这里讨论的 `client` 插件，不是服务端那边的插件，也不是单纯给 `Sources` 提供后端能力的模块，而是 Rootless Store 在运行时真正安装、管理、执行的插件。

它们直接面对三件事：

- 用户如何安装与删除。
- 运行器如何加载与执行。
- 插件自身如何在安卓环境里稳定存在。

## `PluginManifest`

```kotlin
data class PluginManifestLocal(
    // 当前安装版本。
    // 建议遵循 SemVer，例如 `1.2.19`
    // 用于版本展示、更新判断和兼容性比较
    val installedVersion: String,

    // 插件的 UI 展示名称。
    // 这是渲染字段，不具备唯一性语义
    val pluginRenderingName: String,

    // 插件逻辑包名。
    // 建议使用稳定的 Android 风格命名，例如：
    // `com.baidaidai.testplugin`
    val pluginPackageName: String,

    // 插件唯一 ID。
    // 推荐使用稳定高熵值，适合承担 Room 主键和跨版本识别
    val pluginID: String,

    // 插件图标引用。
    // 允许为 `null`
    // 应存 URI 或路径引用，不应直接内嵌二进制
    val iconURI: String?,

    // 插件作者 / 发布者名称
    val author: String,

    // 插件短描述。
    // 适合列表页和详情页摘要展示
    val pluginDescription: String,

    // 插件声明的最低宿主环境要求。
    // 这是声明值，不是运行时实时状态
    val requiredEnvironment: HosterOverallStatus,

    // 插件入口。
    // 应当是包内稳定入口，例如 `index.sh`
    // 或某个二进制入口路径
    val entryPoint: String,

    // 插件运行模型。
    // 一次性任务使用 `OneTime`
    // 长时间运行或需要持续管理的任务使用 `Daemon`
    val pluginRunModel: PluginRunModel,

    // 是否在 ADB 模式下绕过应用作用域的 Environment 包装。
    // 默认值为 `false`
    val bypassEnvironment: Boolean = false,

    // 可选 Web UI 入口。
    // 没有 Web UI 时为 `null`
    val webUIEntryPoint: String? = null,

    // 可选的额外可执行文件声明。
    // 路径应相对插件包根目录
    val executableFiles: List<String>? = null
)

enum class HosterOverallStatus {
    LIMITED, PERMISSIVE, ADB, ROOTD
}

enum class PluginRunModel {
    OneTime, Daemon
}
```

```json
{
  "installedVersion": "1.0.0",
  "pluginRenderingName": "Test Plugin",
  "pluginPackageName": "com.baidaidai.testplugin",
  "pluginID": "29bb10c46772264df3c0d0fade57d2eb",
  "iconURI": "content://rootless_store/plugin_icon/test",
  "author": "Baidaidai",
  "pluginDescription": "A test runtime plugin for Rootless Store.",
  "requiredEnvironment": "PERMISSIVE",
  "entryPoint": "index.sh",
  "pluginRunModel": "OneTime",
  "bypassEnvironment": false,
  "webUIEntryPoint": null,
  "executableFiles": null
}
```

### 字段说明

- `installedVersion`
  版本声明字段。当前类型仅为 `String`，但语义上应视为可比较版本号，不建议把构建信息、日期或文件名直接塞进这里。

- `pluginRenderingName`
  纯展示字段。允许后续改名，不应用它承担唯一标识、依赖定位或安装记录关联。

- `pluginPackageName`
  插件逻辑命名空间。它应稳定、可重复，并尽量符合 Android 包名习惯。即便当前类型系统没有强校验，也不建议使用 `TestPlugin` 这类非规范值。

- `pluginID`
  插件主标识。这个字段的稳定性要求高于 `pluginPackageName`。如果后续 Room 以它作为主键，那么同一插件跨版本升级时不应变化。

- `iconURI`
  图标引用字段。`null` 表示插件没有独立图标。这里存的是引用，不是图标内容本体。引用形式可以是 `content://...`、文件路径或包内相对路径。

- `author`
  作者 / 发布者字段。适合用于展示、来源归属和问题追溯。

- `pluginDescription`
  插件摘要字段。建议保持短文本，不应承担长文档或完整 changelog。

- `requiredEnvironment`
  宿主环境声明字段。当前可序列化值来自 `HosterOverallStatus`，即：
  `LIMITED`、`PERMISSIVE`、`ADB`、`ROOTD`。  
  它表达的是插件要求，不是宿主机当前实时状态。

- `entryPoint`
  插件入口字段。它应当始终指向包内稳定入口，例如 `index.sh`。不建议把动态命令拼接逻辑直接塞进这个字段。

- `pluginRunModel`
  插件运行模型字段。当前可用值为 `OneTime` 和 `Daemon`。

  `OneTime` 适合执行一次后结束的脚本或程序，例如清理、检测、输出一段结果。  
  `Daemon` 适合长时间运行、需要保持后台状态或需要被停止的任务。

- `bypassEnvironment`
  ADB 执行模式下的环境绕过字段，默认值为 `false`。

  当它为 `false` 时，Rootless Store 会尽量把插件执行放进应用作用域的环境包装中。这样插件可以使用已启用 Environment 注入的 `PATH`、`LD_LIBRARY_PATH` 和环境变量，但某些原生 ADB shell 命令可能会因为进入了应用用户上下文而表现不同。

  当它为 `true` 时，Rootless Store 会在 ADB 模式下绕过这层环境包装，让插件更接近普通 ADB shell 的执行语义。这个模式更适合依赖原生 ADB shell 行为的命令，但插件不能使用 Rootless Store 注入的 Environment 变量。

  一般建议：

  - 如果插件依赖 Environment 包提供的工具链、解释器或环境变量，保持 `false`。
  - 如果插件主要执行原生 ADB shell 命令，例如 `cmd`、`pm`、`settings` 等，并且不依赖 Environment 注入能力，可以考虑设为 `true`。
  - 这个字段主要影响 ADB / Shizuku 执行路径；在普通 App Shell 或 Root Shell 场景下，不应把它理解成通用权限开关。

- `webUIEntryPoint`
  可选 Web UI 入口字段。没有 Web UI 时应写为 `null`，或在 JSON 中省略。  
  如果插件提供 Web UI，建议指向包内 `index.html` 的相对路径，例如 `webroot/index.html`。

- `executableFiles`
  可选的额外可执行文件声明。没有额外可执行目标时应写为 `null`，或在 JSON 中省略。  
  如果插件包含多个需要执行权限的脚本或二进制文件，可以在这里声明它们相对插件包根目录的路径。


## 插件包的组成

当前 Rootless Store 的插件包格式，默认是一个 `ZIP` 文件。

一个标准插件包内部，至少应包含下面两类内容：

1. 一个 `PluginManifest.json`
   用于描述插件的版本、入口、运行模型、环境要求和基础元信息。

2. 一个由 `entryPoint` 指向的可执行目标
   例如：
   - 一个 `ELF` 文件
   - 一个 `index.sh`
   - 或者其他可执行程序

也就是说，当前阶段只要一个 `ZIP` 文件中同时包含：

- `PluginManifest.json`
- `entryPoint` 指向的可执行目标

那么它就可以被视为一个相对标准的 Rootless Store Plugin 包。

推荐目录结构可以用 ASCII tree 表示成这样：

```text
test-plugin.zip
├── PluginManifest.json
└── index.sh
```

如果入口是二进制，则可以是这样：

```text
test-plugin.zip
├── PluginManifest.json
└── plugin(ELF)
```

如果插件提供 Web UI，可以增加一个 Web UI 目录，并在 `webUIEntryPoint` 中声明入口：

```text
test-plugin.zip
├── PluginManifest.json
├── index.sh
└── webroot
    └── index.html
```

如果插件包含额外的辅助可执行文件，可以通过 `executableFiles` 声明这些文件：

```text
test-plugin.zip
├── PluginManifest.json
├── index.sh
└── tools
    └── helper
```

目前 Rootless Store 只支持 `ZIP` 作为插件包格式。

## 一个可能的 Demo 插件包

为了帮助开发者更快理解 Rootless Store 运行时插件的最小结构，我们提供一个可能的 demo 插件包。

下载并使用这个 demo 包，即视为你同意遵守 `CC BY` 协议。

除测试用途外，不得将该 demo 包用于任何其他用途，包括但不限于：

- 二次分发
- 商业用途
- 作为正式插件资源直接发布
- 改造后作为其他项目的默认运行时插件使用

下载地址：
<a href="../demo.zip" download="demo.zip">下载 Demo 插件包</a>

## 目前的局限性

### 1. `requiredEnvironment` 环境限制

当前系统还没办法完全强制遵守插件声明的 `requiredEnvironment`。

这意味着即便 manifest 已经声明了环境要求，插件在实际执行时仍然可能出现两种结果：

- 有可能执行成功
- 也有可能执行不成功

也就是说，`requiredEnvironment` 当前仍然更接近声明约束，而不是已经完全收敛成强制执行条件。

### 2. 执行状态的反馈

当前系统还没有把“这个插件到底能不能直接执行”这件事完整、稳定地反馈出来。

后续会逐渐收敛这一层行为：

- 主动通知当前插件是否可以直接执行
- 根据宿主环境上下文判断执行可行性
- 尽量把“可执行 / 不可执行 / 可降级执行”区分清楚

### 3. 模式限制与可执行权限

当前 `entryPoint` 仍然是最稳定的执行入口。即便 `executableFiles` 已经作为 Manifest 字段存在，现阶段也不应把插件设计成复杂、分散、强依赖多级调用链的结构。

如果要执行多个 `ELF` 或多个 `SH` 文件，插件作者仍然需要谨慎处理文件权限、相对路径和调用顺序。  
推荐把主要逻辑收敛到 `entryPoint`，再由它按需要调用包内其他文件。

这属于当前已经明确存在的局限性，后续阶段仍然需要继续协商和解决。
