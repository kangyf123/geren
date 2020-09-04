const util = require('../../utils/util.js');

Component({
  properties: {
    title: {
      type: String,
      value: "日期",
    },
    titleStart: {
      type: String,
      value: "开始时间",
    },
    titleEnd: {
      type: String,
      value: "结束时间",
    },
    start: {
      type: String,
      value: "",
    },
    end: {
      type: String,
      value: "",
    },
    isEndCurrent: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    now: '',
    startDate: {
      prevVal: [],
      conf: [],
      val: [0, 0],
    },
    endDate: {
      prevVal: [],
      conf: [],
      val: [1, 1],
    },
  },

  ready: function() {
    this.initEndDateConf();
    const now = util.getDateObj();
    this.setData({
      now: now.getFullYear() + '-' + (now.getMonth() + 1),
    });
  },
  methods: {
    initEndDateConf: function () {
      let startConf = this.resetSelectorDate('startDate', this.data.start, { max: this.data.end });
      let endConf = this.resetSelectorDate('endDate', this.data.end, { min: this.data.start });
      this.resetSelectorConf(startConf, endConf);
    },
    resetSelectorConf: function (startConf, endConf) {
      if (startConf) {
        const startDate = util.getDateObj(this.data.start),
          startDateVal = [0, 0];
        startConf[0].forEach(function (elem, index) {
          if (startDate.getFullYear() === elem.id) {
            startDateVal[0] = index;
          }
        });

        startConf[1].forEach(function (elem, index) {
          if (startDate.getMonth() + 1 === elem.id) {
            startDateVal[1] = index;
          }
        });
        this.setData({
          startDate: {
            conf: startConf,
            val: startDateVal,
          },
        });
      }
      
      if (endConf) {
        let endDateVal = [1, 0];
        if (this.data.isEndCurrent) {
          endDateVal = [0, 0];
        } else {
          const endDate = util.getDateObj(this.data.end);
          endConf[0].forEach(function (elem, index) {
            if (endDate.getFullYear() === elem.id) {
              endDateVal[0] = index;
            }
          });

          endConf[1].forEach(function (elem, index) {
            if (endDate.getMonth() + 1 === elem.id) {
              endDateVal[1] = index;
            }
          });  
        }
        
        this.setData({
          endDate: {
            conf: endConf,
            val: endDateVal,
          },
        });
      }

      

      
    },
    resetSelectorDate: function (type, date, options = {}) {
      const year = [];
      let month = [];
      const now = util.getDateObj();
      const data = this.data[type];
      let dateObj;
      let curYear = '',
        curMonth = '';
      if (date) {
        dateObj = util.getDateObj(date),
          curYear = dateObj.getFullYear(),
          curMonth = dateObj.getMonth() + 1;
      } else {
        curYear = now.getFullYear();
        curMonth = now.getMonth() + 1;
      }
      
      if (type === 'endDate') {
        year.push({
          id: "",
          name: "至今",
        });
        month.push({
          id: '',
          name: '',
        });
      }

      let maxYear = now.getFullYear(),
        maxMonth = now.getMonth() + 1,
        maxDate = options.max ? util.getDateObj(options.max) : undefined;
      if (options.max) {
        maxYear = maxDate.getFullYear();
        maxMonth = maxDate.getMonth() + 1;
      }

      let minYear = maxYear - 100,
        minMonth = 1,
        minDate = options.min ? util.getDateObj(options.min) : undefined;
        console.log(options.min);
      if (options.min) {
        minYear = minDate.getFullYear();
        minMonth = minDate.getMonth() + 1;
      }
      
      console.log(minDate);
      console.log(minYear);
      for (let i = maxYear; i >= minYear; i--) {
        year.push({
          id: i,
          name: i + '年',
        });
      }
      
      if (this.data.isEndCurrent && type === 'endDate') {
        month = [];
      } else {
        if (!dateObj) {
          if (type === 'endDate') {
            month = this.resetSelectorMonth(type, now, maxDate, minDate);
          } else {
            let curDateInMonth = maxDate ? maxDate : now;
            month = this.resetSelectorMonth(type, curDateInMonth, maxDate, minDate);
          }

        } else {
          month = this.resetSelectorMonth(type, dateObj, maxDate, minDate);
        }
      }
      
      
      return [year, month];
    },
    resetSelectorMonth: function (type, dateObj, maxDate, minDate) {
      const now = util.getDateObj();
      let maxYear = now.getFullYear(),
        maxMonth = maxMonth = now.getMonth() + 1;
      if (maxDate) {
        maxYear = maxDate.getFullYear();
        maxMonth = maxDate.getMonth() + 1;
      }

      let minYear = maxYear - 100,
        minMonth = 1;
      if (minDate) {
        if (minDate.getFullYear() === dateObj.getFullYear()) {
          minMonth = minDate.getMonth() + 1;
        } else {
          minMonth = 1;
        }
      }

      if (maxYear !== dateObj.getFullYear()) {
        maxMonth = 12;
      }

      if (dateObj.getFullYear() === now.getFullYear() && maxMonth > (now.getMonth() + 1)) {
        maxMonth = now.getMonth() + 1;
      }

      let month = [];
      if (type === 'endDate') {
//        month.push({
//          id: '',
//          name: '',
//        });
      }
      for (let i = maxMonth; i >= minMonth; i--) {
        month.push({
          id: i,
          name: i + '月',
        });
      }
      return month;
    },
    bindDateChange: function(e) {
      const arr = e.detail.value;
      const conf = this.data[e.currentTarget.dataset.type].conf;
      let selectedDateText = '';
      if (e.currentTarget.dataset.type === 'endDate') {
        if (arr[0] === 0 && arr[1] === 0) {
          this.setData({
            isEndCurrent: true,
          });
          selectedDateText = '';
        } else {
          this.setData({
            isEndCurrent: false,
          });
          selectedDateText = conf[0][arr[0]].id + '.' + conf[1][arr[1]].id;
        }
      } else {
        selectedDateText = conf[0][arr[0]].id + '.' + conf[1][arr[1]].id;
      }
      
      this.setData({
        [e.currentTarget.dataset.field]: selectedDateText,
      });
      this.triggerEvent('change', {
        type: e.currentTarget.dataset.type,
        value: selectedDateText,
        isEndCurrent: this.data.isEndCurrent,
      });
      if (e.currentTarget.dataset.type === 'startDate') {
//        const conf = this.resetSelectorDate('endDate', selectedDateText, { min: this.data.start });
        const conf = this.resetSelectorDate('endDate', this.data.end, { min: selectedDateText });
        this.resetSelectorConf(undefined, conf);
      }
      if (e.currentTarget.dataset.type === 'endDate') {
//        const conf = this.resetSelectorDate('startDate', selectedDateText, { max: this.data.end });
        const conf = this.resetSelectorDate('startDate', this.data.start, { max: selectedDateText });
        this.resetSelectorConf(conf, undefined);
      }
    },
    bindcancel: function (e) {
      let type = e.currentTarget.dataset.type,
        startConf, endConf;
      if (type === 'startDate') {
        startConf = this.resetSelectorDate('startDate', this.data.start, { max: this.data.end });        
      } else {
        endConf = this.resetSelectorDate('endDate', this.data.end, { min: this.data.start });
      }

      this.resetSelectorConf(startConf, endConf);
    },
    bindcolumnchange: function (e) {
      const type = e.currentTarget.dataset.type;
      
      this.setData({
        [type + '.prevVal']: [...this.data[type].val],
      });

      const data = this.data[type].val;

      data[e.detail.column] = e.detail.value;
      if (type === 'endDate') {
        if (e.detail.column === 0) {
          if (e.detail.value === 0) {
            data[1] = 0;
          } else if (e.detail.value === 1) {
            data[1] = 0;
          } else if (e.detail.value > 1 && this.data[type].prevVal[0] <= 1) {
            data[1] = 0;
          } else if (this.data[type].prevVal[0] === this.data[type].conf[0].length - 1 
            && e.detail.value < this.data[type].conf[0].length - 1) {
            data[1] = 0;
          }
        }
      }
      
      const now = util.getDateObj();
      if (type === 'startDate') {
        let curDate;
        if (data[0] === undefined && data[1] === undefined) {
          curDate = now;
        } else if (data[0] === undefined || data[1] === undefined) {
          curDate = util.getDateObj(this.data.startDate.conf[0][data[0]].id + '-' + '1');
        } else {
          var startDateMonthLen = this.data.startDate.conf[1].length;
          if (data[0] == 0 && this.data.startDate.prevVal[0] > 0) {
            data[1] = 0;
          }
          curDate = this.transSelectorDateToDate(type, data);
        }
        
        let maxDate;
        if (this.data.endDate.val.length === 0) {
          maxDate = now;
        } else {
          maxDate = this.transSelectorDateToDate('endDate', this.data.endDate.val);
        }
        
        const arr = this.resetSelectorMonth(type, curDate, maxDate, undefined);
        this.setData({
          'startDate.conf[1]': arr,
        });
      } else {
        let arr = [];
        if (data[0] > 0) {
          if (this.data.endDate.conf[1].length === 1) {
            let startDate = undefined;
            if (this.data.start) {
              startDate = util.getDateObj(this.data.start);
            }
            let curDate = util.getDateObj(this.data.endDate.conf[0][data[0]].id + "-01");

            arr = this.resetSelectorMonth(type, curDate, undefined, startDate);
          } else {
            let curDate = this.transSelectorDateToDate(type, data);
            let minDate;
            if (this.data.startDate.val.length < 2 || !this.data.start) {
              minDate = undefined;
            } else {
              minDate = this.transSelectorDateToDate('startDate', this.data.startDate.val);
            }
            
            arr = this.resetSelectorMonth(type, curDate, undefined, minDate);
          }
        } else {
          arr.push({
            id: '',
            name: '',
          });
        }

        this.setData({
          'endDate.conf[1]': arr,
        });
        
      }

      this.setTargetDate(type, data[0], data[1]);
    },
    transSelectorDateToDate: function (type, data) {
      const conf = this.data[type].conf;
      let year = conf[0][data[0]].id;
      let month = '';
      if (conf[1].length === 0) {
        const now = util.getDateObj();
        if (year === now.getFullYear()) {
          month = now.getMonth() + 1;
        } else {
          month = 12;
        }
      } else {
        month = conf[1][data[1]].id;
      }
      return util.getDateObj(conf[0][data[0]].id + '-' + month);
    },
    setTargetDate: function (type, start, end) {
      const data = this.data[type].val;
      data[0] = start;
      data[1] = end;
      this.setData({
        [type + '.val']: data,
      });
    },
  },
}) 