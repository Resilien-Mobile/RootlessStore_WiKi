---
title: Server：Market 与 Source 接口
description: Rootless Store 的 Source 与 Market 服务端接口说明
---

# Server：Market 与 Source 接口

这一页只描述当前已经定下来的服务端接口契约  
虽然Market和Source接口是不同的，但是都是为源服务  

Source 接口是提供给 SourceScreen 进行源信息获取和认证  
Market 接口是提供给 MarketScreen 进行获取可用的 Plugins 和 Environments 列表
## Source

一个符合Rootless Store的后端接口  
理应在 `{endpoint}/source/` 下有 `getSourceInfo` 的Get监听器

#### Endpoint

假设你的 endpoint 为: `https://example.com/api`

```text
GET https://example.com/api/source/getSourceInfo
```

#### 请求作用

返回 Source 基础信息，后续会进行 入库->SourceScreen 渲染源入口

#### Response DTO

```kotlin
@Serializable
data class PluginSourceInfoDTO(
    val sourceID: String,
    val sourceName: String,
    val sourceRemoteEndpoint: String,
    val sourceAuthenticationInfo: SourceAuthenticationInfoMetaDTO
)

@Serializable
data class SourceAuthenticationInfoMetaDTO(
    val requireAuthentication: Boolean
)
```

#### Response JSON

```json
{
  "sourceID": "rootless-source",
  "sourceName": "One Available Source",
  "sourceRemoteEndpoint": "https://example.com/api",
  "sourceAuthenticationInfo": {
    "requireAuthentication": true
  }
}
```

#### 字段

- `sourceID`
  Source 主标识，本地持久化、去重、追踪都使用这个字段

- `sourceName`
  用于 `SourceScreen` 显示源名

- `sourceRemoteEndpoint`
  Source 远端基础 endpoint  
  后续所有 Source 相关请求都基于这个地址继续发起

- `sourceAuthenticationInfo`
  用于承载 `requireAuthentication`   
  并发起后续的验证挑战，值可为 `False`

## 验证挑战 🆕

如果前方的 `Response JSON` 返回了一个
```json
"requireAuthentication": true
```
则 Rootless Store 会拉起一个 `ModelBottomSheet`，进行快速身份验证挑战  

Rootless Store 会发送这样一个 `POST` 数据：
```kotlin
@Serializable
data class PluginSourceAuthenticationPostDTO(
    val userName: String,
    val passWord: String
)
```
一个符合 Rootless Store 的后端接口  
理应在 `{endpoint}/source/auth/` 下有 `token` 的 `POST` 监听器

#### Endpoint

假设你的 endpoint 为: `https://example.com/api`

```text
POST https://example.com/api/source/auth/token
```

#### 请求作用

返回特定 User 的唯一标识 Token，后续会进行入库  
并在后续的 Market 请求中附带这个 Token，作为认证

#### Response DTO

```kotlin
@Serializable
data class PluginSourceAuthenticationInfoDTO(
    val userName: String,
    val userAccessToken: String
)
```
#### Response JSON

```json
{
  "userName": "1234567",
  "userAccessToken": "7654321"
}
```

## Market

### Endpoint

```text
GET ${endpoint}/plugin/getAllPlugins
```

假设你的 endpoint 为: `https://example.com/api` ：

```text
GET https://example.com/api/plugin/getAllPlugins
```

### 作用

返回 Market 页面当前页的插件列表，供Paging使用

### Response DTO

```kotlin
@Serializable
data class PluginPageResponseDTO(
    val data: List<RootlessStoreManifestCollection>,
    val meta: MetaDTO
)

@Serializable
data class MetaDTO(
    val limit: Int,
    val hasMore: Boolean
)
```
其中 `RootlessStoreManifestCollection`   
可为 `PluginManifestRemote` 或 `EnvironmentManifestRemote`
```kotlin
// EnvironmentManifestRemote
@Serializable
@SerialName("EnvironmentManifestRemote")
data class EnvironmentManifestRemote(
    override val installedVersion: String,
    override val environmentRenderingName: String,
    override val environmentPackageName: String,
    override val environmentID: String,
    override val iconURI: String?,
    override val author: String,
    override val environmentDescription: String,
    override val requiredEnvironment: HosterOverallStatus,
    override val environmentURI: String,
    override val entryPoint: String,
    override val ldLibraryPath: List<String>,
    override val env: Map<String, String>
)

// PluginManifestRemote
@Serializable
@SerialName("PluginManifestRemote")
data class PluginManifestRemote(
    override val installedVersion: String,
    override val pluginRenderingName: String,
    override val pluginPackageName: String,
    override val pluginID: String,
    override val iconURI: String?,
    override val author: String,
    override val pluginDescription: String,
    override val requiredEnvironment: HosterOverallStatus,
    override val pluginURI: String,
    override val entryPoint: String,

    override val pluginRunModel: PluginRunModel
)
```
为方便 Rootless Store 区分 `EnvironmentManifestRemote` 与 `PluginManifestRemote`，`data` 数组中的每个对象都必须带上 `type` 字段

当前 `type` 可使用以下值：

- `PluginManifestRemote`
- `EnvironmentManifestRemote`

下面用带注释的 `JSONC` 同时展示两种资源结构  
实际接口返回时不要包含 `//` 注释

### Response JSON

```json

// PluginManifestRemote
{
  "data": [
    {
      "type": "PluginManifestRemote",
      "installedVersion": "0.0.1",
      "pluginRenderingName": "Basic Alist",
      "pluginPackageName": "BasicAlist",
      "pluginID": "<PLUGIN_ID>",
      "pluginURI": "http://example.com/pluginAssets/BasicAlist.zip",
      "iconURI": "content://rootless_store/plugin_icon/basicalist",
      "author": "<AUTHOR>",
      "requiredEnvironment": "PERMISSIVE",
      "pluginDescription": "Run OpenAList server on Android through Rootless Store.",
      "entryPoint": "./index.sh",
      "pluginType": "Client",
      "pluginRunModel": "Daemon"
    },
  
  ],
  "meta": {
    "limit": 10,
    "hasMore": false
  }
}


// EnvironmentManifestRemote
{
  "data": [
    {
      "type": "EnvironmentManifestRemote",
      "installedVersion": "3.14.0",
      "environmentRenderingName": "Python 3",
      "environmentPackageName": "Python3",
      "environmentID": "d4f3c2a6a7b44c0fa5a7c6a7b9d8e001",
      "environmentURI": "http://example.com/environmentAssets/Python3.zip",
      "iconURI": null,
      "author": "Baidaidai",
      "requiredEnvironment": "LIMITED",
      "environmentDescription": "Provides a Python runtime for Rootless Store plugins.",
      "entryPoint": "python3",
      "ldLibraryPath": [
        "lib"
      ],
      "env": {
        "PYTHONUNBUFFERED": "1"
      }
    }
  
  ],
  "meta": {
    "limit": 10,
    "hasMore": false
  }
}  
```

### 字段

- `data`
  当前页的资源列表  
  列表项可以是 `PluginManifestRemote`，也可以是 `EnvironmentManifestRemote`

- `data[].type`
  资源类型标识  
  Rootless Store 会根据这个字段决定按 Plugin 还是 Environment 解析  
  如果返回的是 Plugin，值应为 `PluginManifestRemote`；如果返回的是 Environment，值应为 `EnvironmentManifestRemote`

- `meta.limit`
  当前页分页大小

- `meta.hasMore`
  后续是否还有下一页数据

## 有关Paging

`Market` 页面采用 `Paging` 分页机制

- 每页限制固定为 `10`
- 返回数量按 `10` 个为一组
- `hasMore = true` 表示后续还有下一页数据
- `hasMore = false` 表示当前已经到达尾页

开发者建议按 `10` 个资源为单位组织页面数据

## 当前状态与局限性

::: tip Supported Since 1.0
1.0 后，Rootless Store 已支持受保护源与认证源
:::

### 状态

- <Badge type="tip" text="受保护源 Supported" />
- <Badge type="tip" text="认证源 Supported" />
- <Badge type="tip" text="账户登录进入 Source Supported" />
- <Badge type="danger" text="付费源 Unsupported" />
- <Badge type="danger" text="不可见源 Unsupported" />
- <Badge type="danger" text="激活码进入 Source Unsupported" />
- <Badge type="danger" text="Source 内部插件付费下载 Unsupported" />
- <Badge type="danger" text="Source 内部插件付费解锁 Unsupported" />

当前版本已经支持带认证挑战的 Source 模型，但仍不支持付费源、不可见源以及 Source 内部的付费下载或付费解锁

开发者如果现在创建付费源、不可见源，或依赖 Source 内部付费解锁的分发模型，当前版本仍无法提供完整保护能力

### 风险

1. 付费源或不可见源被直接发现
2. Source 内部付费插件被直接泄露

以上风险由开发者自行承担  
需要这类需求的 Providers，请等待后续版本陆续支持后，再创建对应 Source
