//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    screenWidth: 350,
    totalPage: 1,
    page: 1,
    videoList: [],
    serverUrl: "",
    searchContent: ""
  },

  onLoad: function (params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth,
    });

    var searchContent = params.search;
    var isSaveRecord = params.isSaveRecord;
    if (isSaveRecord == null || isSaveRecord == '' || isSaveRecord == undefined) {
      isSaveRecord = 0;
    }

    me.setData({
      searchContent: searchContent
    });

    // 获取当前的分页数
    var page = me.data.page;
    me.getAllVideoList(page, isSaveRecord);
  },

  getAllVideoList: function (page, isSaveRecord) {
    var me = this;
    var serverUrl = app.severUrl;
    wx.showLoading({
      title: 'loading...please wait',
    });

    var searchContent = me.data.searchContent;

    wx.request({
      url: serverUrl + '/video/showAll?page=' + page + "&isSaveRecord=" + isSaveRecord,
      method: "POST",
      data: {
        videoDesc: searchContent
      },
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();

        console.log(res.data);

        // clear cache if it is now first page
        if (page === 1) {
          me.setData({
            videoList: []
          });
        }

        var videoList = res.data.data.rows;
        var newVideoList = me.data.videoList;

        me.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });

      }
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getAllVideoList(1, 0);
  },

  onReachBottom: function () {
    var me = this;
    var currentPage = me.data.page;
    var totalPage = me.data.totalPage;

    // Check if we reached the last page
    if (currentPage === totalPage) {
      wx.showToast({
        title: 'no more video',
        icon: "none"
      })
      return;
    }

    var page = currentPage + 1;

    me.getAllVideoList(page, 0);
  },

  showVideoInfo: function (e) {
    var me = this;
    var videoList = me.data.videoList;
    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);

    wx.redirectTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
    })
  }



})
