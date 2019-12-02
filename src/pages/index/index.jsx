import Taro, { Component } from '@tarojs/taro'
import { View, Map, CoverImage, Navigator } from '@tarojs/components'

import './index.scss'

import Pin from '../../assets/pin.png'
import Center from '../../assets/center.png'
import Buy from '../../assets/buy.png'
import Sell from '../../assets/sell.png'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    longitude: 0,
    latitude: 0,
    markers: []
  }

  handleCenterTap = () => {
    this.map.moveToLocation()
  }

  componentDidMount() {
    this.map = Taro.createMapContext("map")

    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        let { longitude, latitude } = res
        this.setState({
          longitude,
          latitude
        })
      }
    })

    Taro.request({
      url: 'https://ik9hkddr.qcloud.la/index.php/trade/get_list',
      success: (result) => {
        let data = result.data.data

        let markers = data.map((value, index) => {
          return {
            iconPath: value.type === 'buy' ? Buy : Sell,
            id: value.id,
            latitude: value.latitude,
            longitude: value.longitude,
            width: 40,
            height: 40
          }
        })

        this.setState({
          markers
        })
      }
    })
  }

  render() {
    return (
      <View className="wrap">
        <View className="map">
          <Map
            id="map"
            longitude="{{longitude}}"
            latitude="{{latitude}}"
            scale="16"
            markers="{{markers}}"
            show-location
            bindmarkertap="handleMarkerTap"
          ></Map>
          <CoverImage
            className="center"
            src={Center}
            onClick={this.handleCenterTap}
          ></CoverImage>
          <CoverImage
            className="pin"
            src={Pin}
          ></CoverImage>
        </View>
        <View className="nav">
          <Navigator className="publish" open-type="navigateTo" url="/pages/publish/publish">
            <View>
              发布
            </View>
          </Navigator>
          <View className="search" bindtap="handleSearchTap">
            搜索
          </View>
        </View>
      </View>
    )
  }
}

export default Index
