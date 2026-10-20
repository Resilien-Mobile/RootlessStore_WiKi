---
title: Environment：运行时环境包
description: Rootless Store 在 Environment 层面对运行时环境包的基本要求与开发思路。
---

# Environment：运行时环境包

这里讨论的 `Environment` 包，不是普通运行时插件，而是 Rootless Store 在本地安装、管理、启用后，为 Plugin 和 Shell 执行链路提供运行时能力的包。

它们直接面对三件事：

- 用户如何安装、启用、禁用和删除。
- 宿主如何把它提供的能力注入到 `PATH`、`LD_LIBRARY_PATH` 和环境变量中。
- Environment 自身如何组织解释器、可执行二进制文件、脚本、动态库和工具链。

换句话说，Plugin 更关心“我要做什么”，Environment 更关心“我怎么提供运行条件”

## `EnvironmentManifest`

```kotlin
interface EnvironmentManifest {
    // 当前安装版本。
    // 建议遵循 SemVer，例如 `1.2.19`
    // 用于版本展示、更新判断和兼容性比较
    // 也可以使用例如 `arm64-v8a`，区分设备架构
    val installedVersion: String

    // Environment 的 UI 展示名称。
    // 这是渲染字段，不具备唯一性语义
    val environmentRenderingName: String

    // Environment 逻辑包名。
    // 建议使用简易好记的名称，例如：
    // `Python3`
    val environmentPackageName: String

    // Environment 唯一 ID。
    // 推荐使用稳定高熵值，适合承担 Room 主键和跨版本识别
    val environmentId: String

    // Environment 图标引用。
    // 允许为 `null`
    // 应存 URI 或路径引用，不应直接内嵌二进制
    val iconUri: String?

    // Environment 作者 / 发布者名称
    val author: String

    // Environment 短描述。
    // 适合列表页和详情页摘要展示
    val environmentDescription: String

    // Environment 声明的最低宿主环境要求。
    // 这是声明值，不是运行时实时状态
    val requiredEnvironment: ExecutionContext

    // Environment 入口或主要可执行目标。
    // 当前安装时会尝试对它设置可执行权限
    val entryPoint: String

    // 需要追加到 LD_LIBRARY_PATH 的包内路径列表。
    // 每一项都会按 Environment 包目录拼接成绝对路径
    val ldLibraryPath: List<String>

    // 需要注入到执行环境中的环境变量。
    // 当前值会按字面量注入，不会自动做包目录模板替换
    val env: Map<String, String>
}

enum class ExecutionContext {
    LIMITED, PERMISSIVE, ADB, ROOTD
}
```

一个提供 Python 运行时的 Environment manifest 可以先写成这样：

```json
{
  "installedVersion": "3.14.0",
  "environmentRenderingName": "Python 3",
  "environmentPackageName": "Python3",
  "environmentId": "d4f3c2a6a7b44c0fa5a7c6a7b9d8e001",
  "iconUri": null,
  "author": "Baidaidai",
  "environmentDescription": "Provides a Python runtime for Rootless Store plugins.",
  "requiredEnvironment": "LIMITED",
  "entryPoint": "python3",
  "ldLibraryPath": [
    "lib"
  ],
  "env": {
    "PYTHONUNBUFFERED": "1"
  }
}
```

### 字段说明

- `installedVersion`
  版本声明字段。当前类型仅为 `String`，但语义上应视为可比较版本号，不建议把构建日期、压缩包文件名或渠道信息直接塞进这里。

- `environmentRenderingName`
  纯展示字段。允许后续改名，不应用它承担唯一标识、依赖定位或安装记录关联。

- `environmentPackageName`
  Environment 逻辑命名空间，它应稳定、可重复。Rootless Store 会用它组织本地 Environment 目录。

- `environmentId`
  Environment 主标识。这个字段的稳定性要求高于 `environmentRenderingName`。如果后续 Room 以它作为主键，那么同一个 Environment 跨版本升级时不应变化。

- `iconUri`
  图标引用字段。`null` 表示没有独立图标。这里存的是引用，不是图标内容本体。引用形式可以是 `assets/index.png`、文件绝对路径或包内相对路径。

- `author`
  作者 / 发布者字段。适合用于展示、来源归属和问题追溯。

- `environmentDescription`
  Environment 摘要字段。建议说明它提供的运行时能力，例如“提供 Python 解释器与标准库”，而不是写成某个具体插件的功能说明。

- `requiredEnvironment`
  宿主环境声明字段。当前可序列化值来自 `ExecutionContext`，即：
  `LIMITED`、`PERMISSIVE`、`ADB`、`ROOTD`。  
  它表达的是这个 Environment 包对宿主能力的要求，不是宿主机当前实时状态。

- `entryPoint`
  Environment 的主要入口或主要可执行目标。当前系统会在安装后尝试对这个路径设置可执行权限。它不等同于 Plugin 的业务启动入口，Environment 通常不会被用户直接点击运行。

- `ldLibraryPath`
  动态库路径列表。每一项都应是 Environment 包内的相对路径，例如 `lib`、`lib64`。执行时会被拼接到 Environment 安装目录下，再追加到 `LD_LIBRARY_PATH`。

- `env`
  环境变量表。它会被注入到 Plugin 执行和 Shell 执行环境中。当前值按字面量使用，不会自动把 `./lib`、`$ENV_ROOT` 这类路径转换成 Environment 包的实际安装路径。

## Ai Agents 快捷提示词模板
```text
这是 RootlessStore 的 EnvironmentManifest 字段解析：

data class EnvironmentManifest(
    // 当前安装版本。
    // 建议遵循 SemVer，例如 `3.14.0`
    // 用于版本展示、更新判断和兼容性比较
    val installedVersion: String,

    // Environment 的 UI 展示名称。
    // 这是渲染字段，不具备唯一性语义
    val environmentRenderingName: String,

    // Environment 逻辑包名。
    // 建议使用稳定、简洁的名称，例如：
    // `Python3`
    val environmentPackageName: String,

    // Environment 唯一 ID。
    // 推荐使用稳定高熵值，适合承担 Room 主键和跨版本识别
    val environmentId: String,

    // Environment 图标引用。
    // 允许为 `null`
    // 应存 URI 或路径引用，不应直接内嵌二进制
    val iconUri: String?,

    // Environment 作者 / 发布者名称
    val author: String,

    // Environment 短描述。
    // 适合说明它提供的运行时能力
    val environmentDescription: String,

    // Environment 声明的最低宿主环境要求。
    // 这是声明值，不是运行时实时状态
    val requiredEnvironment: ExecutionContext,

    // Environment 的主要入口或可执行目标。
    // 应当是包内稳定入口，例如 `python3`
    val entryPoint: String,

    // 需要追加到 LD_LIBRARY_PATH 的包内相对路径
    val ldLibraryPath: List<String>,

    // 需要注入到执行环境中的环境变量
    val env: Map<String, String>
)

enum class ExecutionContext {
    LIMITED, PERMISSIVE, ADB, ROOTD
}

以及它对应的示例 JSON：

{
  "installedVersion": "3.14.0",
  "environmentRenderingName": "Python 3",
  "environmentPackageName": "Python3",
  "environmentId": "d4f3c2a6a7b44c0fa5a7c6a7b9d8e001",
  "iconUri": null,
  "author": "Baidaidai",
  "environmentDescription": "Provides a Python runtime for Rootless Store plugins.",
  "requiredEnvironment": "LIMITED",
  "entryPoint": "python3",
  "ldLibraryPath": [
    "lib"
  ],
  "env": {
    "PYTHONUNBUFFERED": "1"
  }
}

请你向用户询问需求，并生成合法的 Rootless Store 的 EnvironmentManifest 的 JSON 文本
```

## 注入链路

当前 Environment 包的主路径，可以先按下面这条链理解：

1. 先通过 `SAF`（`Storage Access Framework`）选择 ZIP 文件。
2. Rootless Store 在 ZIP 中查找 `EnvironmentManifest.json`。
3. 如果识别为 Environment 包，就把内容解压到应用内部的 `Environment/{environmentPackageName}` 目录。
4. 安装完成后，系统会尝试对 `entryPoint` 指向的目标设置可执行权限。
5. 用户在 Plugin 页面里的 `Environment` 标签中启用这个 Environment。
6. 当 Plugin 或 Shell 开始执行时，Rootless Store 会收集所有已启用的 Environment，并注入 运行时PATH 等信息。

可以把它理解成这样一条链：

```text
SAF 选文件
-> 读取 EnvironmentManifest.json
-> 解压到 App Internal Storage / Environment
-> 设置 entryPoint 可执行权限
-> 用户启用 Environment
-> Plugin / Shell 执行时注入 PATH、LD_LIBRARY_PATH 和 env
```

这里最关键的是：Environment 包不是独立业务入口，而是执行环境提供者。

当前注入行为可以先这样理解：

- `PATH`
  会追加所有已启用 Environment 的包目录。

- `LD_LIBRARY_PATH`
  会根据 `ldLibraryPath` 中声明的相对路径，拼接到对应 Environment 包目录下。

- `env`
  会把 manifest 中的键值对注入到执行环境中。

因此，如果你希望插件可以直接调用 `python3`，最稳妥的方式是让 `python3` 或一个同名 wrapper 位于 Environment 包根目录。  
如果把二进制文件放在 `bin/python3`，当前系统只会按 `entryPoint` 对它设置可执行权限，但不会自动把 `bin` 加进 `PATH`。

## Environment 包的组成

当前 Rootless Store 的 Environment 包格式，默认也是一个 `ZIP` 文件。

一个标准 Environment 包内部，至少应包含下面两类内容：

1. 一个 `EnvironmentManifest.json`
   用于描述 Environment 的版本、入口、宿主要求、动态库路径和环境变量。

2. 一组运行时文件
   例如：
   - 一个 `python3` 可执行文件
   - 一个 `busybox` 可执行文件
   - 一个 `node` 可执行文件
   - 一组 `lib` 动态库
   - 一组脚本、标准库或工具链文件

推荐目录结构可以用 ASCII tree 表示成这样：

```text
python-environment.zip
├── EnvironmentManifest.json
├── python3
├── lib
│   └── libpython3.14.so
└── python-stdlib
    └── ...
```

如果提供的是 BusyBox 或单文件工具链，也可以更简单：

```text
busybox-environment.zip
├── EnvironmentManifest.json
└── busybox
```

如果确实需要把主程序放进子目录，也可以这样组织：

```text
python-environment.zip
├── EnvironmentManifest.json
├── bin
│   └── python3
└── lib
    └── libpython3.14.so
```

但在当前实现下，`PATH` 默认加入的是 Environment 包根目录，不是 `bin` 子目录。  
所以这种结构更适合由包根目录的 wrapper 转发到 `bin/python3`，或者等待后续更细粒度的路径声明能力。

## Plugin 如何使用 Environment

Plugin 不需要把 Python、BusyBox 或其他大型运行时重复打进自己的插件包。  
更合理的方式是：

1. Environment 包负责提供运行时能力。
2. 用户在 Rootless Store 中安装并启用 Environment。
3. Plugin 的 `entryPoint` 只调用这些运行时能力。

例如某个 Plugin 的 `index.sh` 可以这样写：

```sh
#!/system/bin/sh
python3 main.py
```

前提是已经启用了一个可以在 `PATH` 中提供 `python3` 的 Environment 包。

这种分工能减少重复打包，也能让多个 Plugin 复用同一套运行时环境。

## 目前的局限性

### 1. Environment 选择还不是按插件精确绑定

当前执行时会收集所有已启用的 Environment，并统一注入到 Plugin 和 Shell 执行环境中。

这意味着现阶段更接近“全局启用环境”，而不是“某个 Plugin 精确绑定某个 Environment”。

后续更理想的方向是：

- Plugin 声明自己需要哪些 Environment。
- Rootless Store 根据声明检查是否已安装、已启用。
- 执行时只注入真正需要的 Environment。

### 2. `PATH` 注入粒度仍然比较粗

当前 `PATH` 注入的是 Environment 包目录本身。

也就是说，如果希望用户或 Plugin 能直接调用某个命令，最好把可执行文件或 wrapper 放在 Environment 包根目录。

如果运行时文件放在 `bin`、`usr/bin` 等子目录，当前不会自动把这些目录加入 `PATH`。

### 3. 可执行权限还不是全量递归处理

当前系统主要会尝试对 `entryPoint` 指向的目标设置可执行权限。

如果 Environment 包中包含多个 ELF、多个脚本或复杂调用链，仍然可能需要额外处理执行权限。

## 一个可用的 Python Environment 包

为了帮助开发者更快理解 Rootless Store Environment 包的实际结构，我们提供一个可用的 Python 3 Environment 包。

这个包内部包含：

- `EnvironmentManifest.json`
- `python3`
- `lib`
- `include`
- `LICENSE.txt`

它的 `EnvironmentManifest.json` 声明了：

- `environmentRenderingName`: `Python 3`
- `environmentPackageName`: `Python3`
- `entryPoint`: `python3`
- `ldLibraryPath`: `["lib"]`
- `requiredEnvironment`: `ADB`

安装并启用后，Plugin 或 Shell 执行时可以通过当前 Environment 注入链路调用 `python3`。

下载并使用这个 Python Environment 包，即视为你同意遵守包内 `LICENSE.txt` 中声明的 `CC BY-NC-SA 4.0` 协议。

除测试用途外，不得将该 Python Environment 包用于任何其他用途，包括但不限于：

- 二次分发
- 商业用途
- 作为正式 Environment 资源直接发布
- 改造后作为其他项目的默认运行时环境使用

下载地址：
<a href="../Python3.zip" download="Python3.zip">下载 Python 3 Environment 包</a>
