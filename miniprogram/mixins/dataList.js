module.exports = {
  data: {             // 这块之所以不用下划线
    _dataList: {
      _field: '',
      _originList: [],
      _list: [],
      _selected: {},
      _selectedCount: 0,
      _maxSelectedCount: 1,
      _kwd: '',
      _isEdited: false,
    },
  },
  _removeKwd: function () {
    this._searchList('');
    this.searchState('remove');
  },
  _searchList: function (e) {
    let value,
      dataList = this.data._dataList;
    if (typeof e === 'object') {
      value = e.detail.value;
    } else {
      value = e;
    }

    if (dataList._originList.length === 0) {
      this.setData({
        '_dataList._originList': Object.assign(dataList._originList, dataList._list),
      });
    }

    const list = [];
    dataList._originList.forEach(function (elem) {
      if (elem.name.indexOf(value) > -1) {
        list.push(elem);        
      }
    });
    this.setData({
      '_dataList._list': list,
      '_dataList._kwd': value,
    });

    this.searchState('search',value);
  },
  searchState() {

  },
  _addToSelected: function (e) {
    let index;
    if (typeof e === 'object') {
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }

    const dataList = this.data._dataList;
    const item = dataList._list[index];
    if (dataList._selected[item.id]) {
      this._removeSelected(dataList._selected[item.id].id);
      return;
    }
    if (Object.keys(dataList._selected).length >= dataList._maxSelectedCount) {
      if (dataList._maxSelectedCount == 1) {
        this._removeSelected(Object.keys(dataList._selected)[0]);
        this._addToSelected(e);
        return;
      }
      wx.showToast({
        title: '最多应选择' + dataList._maxSelectedCount + '条数据',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    const selected = dataList._selected;
    selected[item.id] = {
      index: index,
      id: item.id,
      name: item.name,
    };

    this.setData({
      '_dataList._selected': selected,
    });
    this._updateSelectedCount();

    // 如果是用户主动触发的选择地点的操作的处理情形
    if (typeof e === 'object') {
      this.setData({
        '_dataList._isEdited': true,
      });

      this._afterAddToSelected(selected[item.id]);
    }
  },
  _updateSelectedCount: function () {
    const selected = this.data._dataList._selected;
    this.setData({
      '_dataList._selectedCount': Object.keys(selected).length,
    });
    
  },
  _removeSelected: function (e) {
    let id;
    if (typeof e === 'object') {
      id = e.currentTarget.dataset.id;
    } else {
      id = e;
    }

    const dataList = this.data._dataList;
    const selected = dataList._selected;
    let removedData = undefined;
    if (selected[id]) {
      removedData = selected[id];
      delete selected[id];
    }
    this.setData({
      '_dataList._selected': selected,
      '_dataList._isEdited': true,
    });
    this._updateSelectedCount();
    this._afterRemoveSelected(removedData);
  },
  _afterAddToSelected: function () {},
  _afterRemoveSelected: function () {},
  _dataSubmit: function (type) {
    if (typeof type == 'object') {
      type = type.currentTarget.dataset.fieldtype;
    }
    const dataList = this.data._dataList;
    if (dataList._selectedCount < 1) {
      return;
    }

    wx.setStorageSync(type, {
      url: '',
      field: dataList._field,
      data: dataList._selected,
    });
    wx.navigateBack();
    // wx.navigateTo({
    //   url:'/pages/resume/basic/basic'
    // })
  },
}