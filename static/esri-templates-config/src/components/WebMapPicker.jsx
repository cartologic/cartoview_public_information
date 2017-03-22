import React from 'react';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';

function PickerItem (props){
  const classes = classNames(['list-group-item', {active: props.selected}]);
  return <a href="#" className={classes} onClick={(e) => {e.preventDefault(); props.onClick()} }>
    {props.children}
  </a>;
}

class WebMapPicker extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false,
      selected: props.value,
      page: 1,
      mapData: null
    };
    Object.defineProperty(this, 'value', {
      get: () => { return this.state.selected; },
      set: (val) => { this.setState({selected: val }) }
    });
    this._mapDataCashe = {};
  }
  loadMaps(page){
    const itemsPerPage = this.props.itemsPerPage || 6;
    const params = {
      q: '(group:"2f0ec8cb03574128bd673cefab106f39")  -type:"Attachment"',//TODO remove static query.
      start: ((page - 1) * itemsPerPage) + 1,
      num: itemsPerPage
    }
    var query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
    var url = this.props.portalHomeUrl + "sharing/rest/search?" + query;
    fetch(url, {
      credentials: 'include'
    }).then(res => res.json()).then((data) => {
      this.setState({items: data.results});
    });
  }
  componentDidMount(){
    if(this.value){
      this.loadMapData();
    }
  }
  render(){
    var {selected, mapData, isModalOpen, items} = this.state;
    let paging = null;
    var selectedItem = null;

    return <div className="cv-picker">
        <div>
          {
            selected && mapData &&
            <div>
              <img src={mapData.item.thumbnail}/>
              <h4 className="list-group-item-heading">{mapData.item.title}</h4>
            </div>
          }
          <Button bsStyle="primary" onClick={(e) => this.openModal()}>{selected ? 'Change' : 'Select'}</Button>
        </div>

        <Modal show={this.state.isModalOpen} onHide={(e) => this.closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="list-group">
              {
                items && items.map((item) => {
                  return <PickerItem key={item.id} selected={selected==item.id} onClick={(e) => this.value = item.id}>
                    <img src={item.thumbnail}/>
                    <h4 className="list-group-item-heading">{item.title}</h4>
                  </PickerItem>
                })
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => this.closeModal(true)}>Ok</Button>
            <Button onClick={(e) => this.closeModal()}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>;
  }


  openModal(){
    if(!this.state.items){
      this.loadMaps(this.state.page);
    }
    this.setState({
      isModalOpen: true
    })
  }
  closeModal(selected){
    this.setState({
      isModalOpen: false
    });
    if(selected && this.props.value != this.value){
      if(this.props.onChange) this.props.onChange({target: this});
      this.loadMapData();
    }
  }
  _updataMapData(mapData){
    this.setState({ mapData });
    if(this.props.onMapDataChanged){
      this.props.onMapDataChanged(mapData);
    }
  }
  loadMapData(){
    var mapData = this._mapDataCashe[this.value];
    if(mapData){
      this._updataMapData(mapData);
    }
    else{
      mapData = {}
      this._mapDataCashe[this.value] = mapData;
      var url = this.props.portalHomeUrl + "sharing/rest/content/items/"+ this.value + "?f=json"
      console.log(url);
      fetch(url, {
        credentials: 'include'
      }).then(res => res.json()).then((item) => {
        mapData.item = item;
        url = this.props.portalHomeUrl + "sharing/rest/content/items/"+ this.value + "/data?f=json"
        fetch(url, {
          credentials: 'include'
        }).then(res => res.json()).then((data) => {
          mapData.data = data;
          this._updataMapData(mapData);
        })

      });
    }
  }
}
export default WebMapPicker;
