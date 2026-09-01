import { Button, Form, Input, Table } from 'antd'
import { useCallback, useState, useEffect, useMemo } from 'react'
import { ColumnsType } from 'antd/es/table'
import { message, Image, Badge } from 'antd'
import { userSearch, freeze } from '../../interface/interfaces'
import './userManage.css'
import { useForm } from 'antd/es/form/Form'

interface SearchUser {
  username: string
  nickName: string
  email: string
}

export interface UserSearchResult {
  id: number
  username: string
  nickName: string
  email: string
  headPic: string
  createTime: Date
  isFrozen: boolean
}

/* const data = [
  {
    key: '1',
    username: 'xx',
    headPic: 'xxx.png',
    nickName: 'xxx',
    email: 'xx@xx.com',
    createTime: new Date(),
  },
  {
    key: '12',
    username: 'yy',
    headPic: 'yy.png',
    nickName: 'yyy',
    email: 'yy@yy.com',
    createTime: new Date(),
  },
]
 */
export function UserManage() {
  const [pageNo, setPageNo] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [userResult, setUserResult] = useState<UserSearchResult[]>()
  const [num, setNum] = useState(0)

  const searchUser = useCallback(async (values: SearchUser) => {
    const res = await userSearch(
      values.username,
      values.nickName,
      values.email,
      pageNo,
      pageSize,
    )

    const { data } = res.data
    if (res.status === 201 || res.status === 200) {
      setUserResult(
        data.users.map((item: UserSearchResult) => {
          return {
            key: item.username,
            ...item,
          }
        }),
      )
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }, [])

  useEffect(() => {
    searchUser({
      username: form.getFieldValue('username'),
      email: form.getFieldValue('email'),
      nickName: form.getFieldValue('nickName'),
    })
  }, [pageNo, pageSize, num])

  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo)
    setPageSize(pageSize)
  }, [])

  const columns: ColumnsType<UserSearchResult> = useMemo(
    () => [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '头像',
        dataIndex: 'headPic',
        render: (value) => {
          return value ? (
            <Image width={50} src={`http://localhost:3001/uploads/${value}`} />
          ) : (
            ''
          )
        },
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
      },
      {
        title: '状态',
        dataIndex: 'isFrozen',
        render: (_, record) =>
          record.isFrozen ? <Badge status="success">已冻结</Badge> : '',
      },
      {
        title: '操作',
        render: (_, record) => (
          <a
            href="#"
            onClick={() => {
              freezeUser(record.id)
            }}
          >
            冻结
          </a>
        ),
      },
    ],
    [],
  )

  const freezeUser = useCallback(async (id: number) => {
    const res = await freeze(id)

    const { data } = res.data
    if (res.status === 201 || res.status === 200) {
      message.success('冻结成功')
      setNum(Math.random())
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }, [])

  const [form] = useForm()

  return (
    <div id="userManage-container">
      <div className="userManage-form">
        <Form
          form={form}
          onFinish={searchUser}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="昵称" name="nickName">
            <Input />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入合法邮箱地址!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索用户
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="userManage-table">
        <Table
          columns={columns}
          dataSource={userResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
          }}
        />
      </div>
    </div>
  )
}
