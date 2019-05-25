// pages/Calendar/Calendar.js
//打卡日历页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days:[],
    cur_day:0,
    cur_year:0,
    cur_month:0,
    ban:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前年月  
    const date = new Date();
    const cur_day = date.getDate();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    //标记当天状态
    this.onJudgeSign(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch,
      cur_day
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 获取当月共多少天
  getThisMonthDays:function(year, month){
      return new Date(year, month, 0).getDate()
  },
    
  // 获取当月第一天星期几
  getFirstDayOfWeek:function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids:function(year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({days:[]});
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);    
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj  = {
          date:null,
          isSign:false,
          onDuty:0,
        }
        that.data.days.push(obj);
      }
      this.setData({
        days:that.data.days
      });
    //清空
    } else {
      this.setData({
        days: []
      });
    }
  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays:function(year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }
    this.setData({
      days:that.data.days
    });
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign:function(Lyear, Lmonth){
    var myDate = new Date();
    var today = myDate.getDate()
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var getTime = myDate.getTime()

    // var date = new Date()
    // var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    var dateStra = ['2019', '4', '28'].join('-');
    var a = new Date(dateStra).getTime();
    var daysArr = this.data.days;
    for (var j = 0; j < daysArr.length;j++){
      //判断当天是否休息
      var dateStrb = [Lyear, Lmonth, daysArr[j].date].join('-');
      var b = new Date(dateStrb).getTime();
      var onduty=Math.floor((b-a)/(24*3600*1000))%4
      daysArr[j].onDuty = onduty;
      if (onduty = 3){
        this.setData({ban:'中班'})
      }else if(onduty = 2){
        this.setData({ban:'小夜班'})
      }else if(onduty = 1){
        this.setData({ban:'大夜班'})
      }else{
        this.setData({ban:'休息'})
      }
      //标记当天
      if (daysArr[j].date == today && year == Lyear && month == Lmonth){
        daysArr[j].isSign = true;
      }
    }
    this.setData({days:daysArr});
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar:function(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onJudgeSign(newYear, newMonth);      
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onJudgeSign(newYear, newMonth);      
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
})