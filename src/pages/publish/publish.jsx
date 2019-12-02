import Taro, { 
  Component, 
  Fragment
} from '@tarojs/taro'

import {
  RadioGroup,
  Radio,
  Text,
  View,
  Input,
  Button,
  Icon
} from '@tarojs/components'

import './publish.scss'

export default class Publish extends Component {
  state = {
    address: '点击选择，要勾选哦~',
    isSubmit: false,
    isSucc: false
  }

  renderNotic = (props) => {
    console.log(props.state)
    let type = props.state.isSucc ? 'success' : 'cancel'
    let info = props.state.isSucc ? '成功' : '失败'
    let className = props.state.isSucc ? 'btn-succ' : 'btn-fail'
    return (
      <Fragment>
        <View className="icon">
          <Icon type={type} size="40"/> 数据提交 {info}
        </View>
        <View>
          <Button className="btn" className={className} onClick={props.handleBacktap}>返回</Button>
        </View>
      </Fragment>
    )
  }

  handleChooseLocationTap = () => {
    Taro.chooseLocation({
      success: (result) => {
        let { address, longitude, latitude } = result
        this.setState({
          address,
        })
        this._staticData.longitude = longitude
        this._staticData.latitude = latitude
      }
    })
  }

  radioChange = (e) => {
    this._staticData.type = e.detail.value
  }

  handleMessageInput = (e) => {
    this._staticData.message = e.detail.value
  }

  handleContactInput = (e) => {
    this._staticData.contact = e.detail.value
  }

  showToast(title) {
    Taro.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  }

  handleSubmit = () => {
    let data = {
      address: this.state.address,
      ...this._staticData
    }

    if (this.state.address === '点击选择，要勾选哦~') {
      this.showToast('请选择地址')
      return
    }

    if (!this._staticData.message) {
      this.showToast('请填写说明')
      return
    }
    if (!this._staticData.contact) {
      this.showToast('请填写联系方式')
      return
    }

    Taro.request({
      url: 'https://ik9hkddr.qcloud.la/index.php/trade/add_item', //仅为示例，并非真实的接口地址
      data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setState({
          isSubmit: true,
          isSucc: res.data.ret,
        })
      }
    })
  }

  handleBacktap(e) {
    // this.setState({
    //   isSubmit: e.detail
    // })
  }

  componentWillMount() {
    this._staticData = {
      type: 'buy'
    }
  }

  render() {
    console.log('render')
    let { address, isSubmit, isSucc} = this.state
    return (
      <Fragment>
        {
          !this.state.isSubmit && (
            <View className="wrap">
              <View className="item">
                <View className="label">
                  我的地址
                </View>

                <View className="content" onClick={this.handleChooseLocationTap}>
                  {address}
                </View>
              </View>

              <View className="item">
                <View className="label">
                  类型
                </View>
                <View className="content">
                  <RadioGroup className="radio-group" onChange={this.radioChange}>
                    <Radio className="radio" value="buy" checked="true">
                      <Text>求购</Text>
                    </Radio>
                    <Radio className="radio" value="sell" style="margin-left: 20rpx;">
                      <Text>转让</Text>
                    </Radio>
                  </RadioGroup>
                </View>
              </View>

              <View className="item">
                <View className="label">
                  说明
                </View>
                <View className="content">
                  <Input className="weui-input" onInput={this.handleMessageInput} placeholder="请写您的具体需求" />
                </View>
              </View>

              <View className="item">
                <View className="label">
                  联系方式
                </View>
                <View className="content">
                  <Input className="weui-input" onInput={this.handleContactInput} placeholder="填写您的联系方式" />
                </View>
              </View>

              <Button className="btn" type="default" onClick={this.handleSubmit}>发布信息</Button>
            </View>
          )
        }
        {
          isSubmit && (
            <View>
              {this.renderNotic(this)}
            </View>
          )
        }
      </Fragment>
    )
  }
}

// Publish.styleIsolation = 'shared'