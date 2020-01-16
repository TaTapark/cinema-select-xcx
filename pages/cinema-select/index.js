// pages/cinema-select/index.js
var jsonData = require('../../data/json.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiper_options: {
      autoplay: false,
      circular: true,
      interval: 500,
      duration: 500,
      dots: false,
      indicator_color: 'rgba(255,255,255,0.7)',
      indicator_active_color: '#ffffff'
    },
    current: 0, // 轮播图默认展示下标
    tabType: 0, // 判定tab切换选定位置
    headName: '', // 选中电影名称
    headRemark: '', // 选中电影名称评分
    headmovies: [], // 轮播图片数据
    tabList: [], // tab切换时间选择数据
    moviesList: [] // 选场次数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchSchedule()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  fetchSchedule () {
    const { data = [] } = jsonData.data // 此处为模拟数据 接口数据由此接入
    // 头部轮播数据处理开始
    data &&
      data.map((item, index) => {
        this.data.headmovies.push({ poster: item.poster, text: index, movie_id: item.movie_id, show_name: item.show_name, remark: item.remark, noClick: false })
        this.data.tabList.push(item.schedules)
      })
    const temp1 = { poster: '', movie_id: '', show_name: '', remark: '', noClick: true } // 导入三条假数据填充轮播数据，时间紧急暂未找到好的解决方式，欢迎交流
    this.data.headmovies.push(temp1)
    this.data.headmovies.push(temp1)
    this.data.headmovies.push(temp1)
    // if (this.data.options.movie_id !== '') {   // 该逻辑判断入口电影，轮播到指定电影
    //   this.getCurrentNum()// 默认查询显示查询电影
    // }
    // 头部轮播数据结束
    this.setData(
      {
        hasLoaded: true,
        showLoader: false,
        headmovies: this.data.headmovies,
        tabList: this.data.tabList,
        tabListShow: this.data.tabList[this.data.current].length > 0 ? this.data.tabList[this.data.current] : [], // 默认展示tab数据
        moviesList: this.data.tabList[this.data.current].length > 0 ? (this.data.tabList[this.data.current][0].data.length > 0 ? this.data.tabList[this.data.current][0].data : []) : [], // 默认展示电影列表
        headName: this.data.headmovies[this.data.current].show_name ? this.data.headmovies[this.data.current].show_name : '',
        headRemark: this.data.headmovies[this.data.current].remark ? this.data.headmovies[this.data.current].remark : ''
      }
    )
  },

  getCurrentNum () { // 筛选进入电影是否在轮播数据中 并 选中该电影
    this.data.headmovies.filter((ele, idx) => {
      if (ele.movie_id === this.data.options.movie_id) {
        this.setData({
          current: idx
        })
      }
    })
  },
  intervalChange (e) { // 动画结束计算展示数据
    const current = e.detail.current
    this.setData({
      current: current,
      tabType: 0, // 初始化时间组件
      headName: this.data.headmovies[current].show_name,
      headRemark: this.data.headmovies[current].remark,
      tabListShow: this.data.tabList[current] ? this.data.tabList[current] : []

    })
    this.initMovieList(current)// 初始化选场次列表
  },
  goToCenter (e) { // 轮播图片点击事件
    const { current, noclick } = e.currentTarget.dataset
    if (noclick) { // 目的实现 后三条假数据不被触发
      return
    }
    this.setData({
      current: current
    })
  },
  initMovieList () { // 初始化选场次列表
    this.setData({
      moviesList: this.data.tabListShow[0] ? this.data.tabListShow[0].data : []
    })
  },
  switchStatus (e) { // 切换时间选择
    const { type } = e.target.dataset
    if (this.data.tabType === type) return
    this.setData(
      {
        moviesList: this.data.tabListShow[type].data,
        tabType: type
      }
    )
  },
  buyTick () {
    wx.showToast({
      title: '添加自己购票跳转逻辑',
      icon: 'none',
      duration: 2000
    })
  }
})
