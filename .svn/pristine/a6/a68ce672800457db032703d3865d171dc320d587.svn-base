

# /api/onetree 懒加载接口参数说明

1.`orgtype`：机构类型  机构类型 机构类别（0：现场 1：车辆 2：人脸 3: 单兵 4: 巡更）

2.`oid`：机构id 

3.`eid`: 设备id

4.`restype` 资源类型 支持多种资源类型（用 ‘,’ 好分隔，eg: 1,2）

5.`equtype` 设备类型 与资源类型相同用法

6.`resource` true/false true: 返回数据包含资源 false: 返回数据不包含资源

7.`equipment` true/false true: 返回数据包含设备 false: 返回数据不包含设备


## 接口传参示例 *(注：没有写的参数可不传)
1.获取根机构
### api/onetree? orgtype=0 (切记不可传oid)
2.获取机构下的 机构 设备 资源 (注：资源是点击设备加载出来的)
### api/onetree? oid= & equipment=true & equtype= &
3.获取上设备下的资源
### api/onetree? eid= & equipment=true &
3.获取机构下的 机构 资源（没有设备层）
### api/onetree? oid= & resource=true & restype=
4.获取纯机构
### api/onetree? oid=

# /api/onetree/seek 资源 或 机构 搜索
1.`restype` 资源类型 支持多种资源类型（用 ‘,’ 好分隔，eg: 1,2）

2.`orgtype`：机构类型  机构类型 机构类别（0：现场 1：车辆 2：人脸 3: 单兵 4: 巡更）

2.`orgseek`: 搜索机构的字段 

3.`resseek`: 搜索资源的字段

## 接口传参示例 *(注：没有写的参数可不传)
1.搜索机构
###  /api/onetree/seek? orgtype= & orgseek=
2.搜索资源
### /api/onetree/seek? restype= & resseek=