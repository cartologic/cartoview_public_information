import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import ColorPicker from "./components/ColorPicker.jsx"
import WebMapPicker from "./components/WebMapPicker.jsx"
import LayerAndFieldSelector from "./components/LayerAndFieldSelector.jsx"
import MultilayerAndFieldSelector from "./components/MultilayerAndFieldSelector.jsx"
import {Tab, Nav, NavItem, Col, Row, FormGroup, FormControl,
        ControlLabel, HelpBlock, OverlayTrigger, Tooltip,
        Checkbox, FieldGroup, Pager, Button, Glyphicon} from 'react-bootstrap'
global.React = React;
global.ReactDOM = ReactDOM;
global.WebMapPicker = WebMapPicker;


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      values: props.config || {},
      activeTab: 0,
      errors: {}
    }
  }
  hasErrors(){
    return Object.keys(this.state.errors).length > 0;
  }
  render(){
    //configurationSettings
    const {configurationPanel, activeTab, saving} = this.state;
    if (!configurationPanel) return null; // TODO return loading indicator
    const defaultValues = configurationPanel.values;
    const setActiveTab = (activeTab) => {
      this.setState({activeTab});
    }
    return <div>
      <Tab.Container id="left-tabs-example" activeKey={activeTab} onSelect={setActiveTab}>
        <Row className="clearfix">
          <Col sm={4}>
            <Nav bsStyle="pills" stacked>
              {
                configurationPanel.configurationSettings.map((fieldset, index) => {
                  var hasErrors = false;
                  if(this.hasErrors()){
                    fieldset.fields.forEach((f) => {
                      if(this.state.errors[f.fieldName])
                        hasErrors = true;
                    });
                  }
                  const classes = classNames({
                    error: hasErrors
                  });
                  return <NavItem eventKey={index} className={classes}>
                    <span dangerouslySetInnerHTML={{__html:fieldset.category}} ></span>
                    {hasErrors && <Glyphicon className="pull-right" glyph="alert"/>}
                  </NavItem>
                })
              }

            </Nav>
          </Col>
          <Col sm={8}>
            <Tab.Content animation>
            {
              configurationPanel.configurationSettings.map((fieldset, index) => {
                return <Tab.Pane eventKey={index}>
                  <h3 dangerouslySetInnerHTML={{__html:fieldset.category}} ></h3>
                  {fieldset.fields.map((f, index) => {
                    return <div key={index}>{this.getField(f, defaultValues[f.fieldName]) } </div>;
                  })}
                </Tab.Pane>
              })
            }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <div className="footer-tb">
        <Pager>
          <Pager.Item href="#" disabled={activeTab==0} onClick={(e) => setActiveTab(activeTab - 1)}>Previous</Pager.Item>
          {' '}
          <Pager.Item href="#" disabled={activeTab==configurationPanel.configurationSettings.length - 1} onClick={(e) => setActiveTab(activeTab + 1)}>Next</Pager.Item>
          { ' ' }
          <Button bsStyle="primary" onClick={(e) => this.save()}><i className="fa fa-floppy-o"></i> Save</Button>
          { ' ' }
          {!this.props.isNew && <a className="btn btn-info" href="../view/"><Glyphicon glyph="view" /> View</a>}
          { ' ' }
          {saving && <span className="text-info"> <Glyphicon className="icon-animate" glyph="refresh" /> Saving...</span>}
        </Pager>

      </div>
    </div>;
    //return <Picker items={this.state.items} renderItem={(item) => this.renderItem(item)} onChange={(e)=> this.onMapSelected(e)}/>
  }
  loadConfigurationPanel(){
    fetch(this.props.configurationPanelUrl, {
      credentials: 'include'
    }).then(res => res.json()).then((data) => {
      this.setState({configurationPanel: data});
    });
  }
  componentDidMount(){
    this.loadConfigurationPanel();
  }

  onMapSelected(e){
    console.log('map: ', e.target.value);
  }
  getField(field, defaultValue){
    if(field.type == "paragraph"){
      return <FormGroup>
        <HelpBlock dangerouslySetInnerHTML={{__html:field.value}} >
        </HelpBlock>
      </FormGroup>;
    }

    var value = this.state.values.hasOwnProperty(field.fieldName) ? this.state.values[field.fieldName] : defaultValue;
    var validationState = this.state.errors[field.fieldName] ? "error" : null;
    const onChange = (e) => {
        if(field.type == "boolean"){
          console.log(e.target.checked);
          this.state.values[field.fieldName] = e.target.checked;
        }
        else{
          if(e.target.value == undefined){
            delete this.state.values[field.fieldName];
          }
          else {
            this.state.values[field.fieldName] = e.target.value;
          }
        }
        this.setState({
          values: this.state.values
        });
    }

    var fieldEl = null;
    if(field.options){
      fieldEl =  (<FormGroup validationState={validationState}>
        <ControlLabel>{field.label}</ControlLabel>
        <FormControl componentClass="select" placeholder={field.label} value={value}  onChange={onChange}>
          {field.options.map(o => <option value={o.value}>{o.label}</option>)}
        </FormControl>
        {validationState && <HelpBlock>{this.state.errors[field.fieldName]}</HelpBlock>}
      </FormGroup>) ;
    }
    else if(field.stringFieldOption == "richtext"){
      fieldEl =  (<FormGroup validationState={validationState}>
        <ControlLabel>{field.label}</ControlLabel>
        <FormControl componentClass="textarea" placeholder={field.label} value={value} onChange={onChange}/>
        {validationState && <HelpBlock>{this.state.errors[field.fieldName]}</HelpBlock>}
      </FormGroup>)
    }
    else if(field.type == "boolean"){
      fieldEl = <Checkbox checked={!!value} onChange={onChange}>
        {field.label}
        {field.tooltip && (field.label != field.tooltip) && <HelpBlock>{field.tooltip}</HelpBlock>}
      </Checkbox>
    }
    else if (field.type == "string"){
      fieldEl = (<FormGroup validationState={validationState}>
        <ControlLabel>{field.label}</ControlLabel>
        <FormControl type="text" placeholder={field.label} value={value} onChange={onChange}/>
        {validationState && <HelpBlock>{this.state.errors[field.fieldName]}</HelpBlock>}
      </FormGroup>);
    }
    else if (field.type == "number"){
      const constraints = field.constraints || {}
      fieldEl = (<FormGroup validationState={validationState}>
        <ControlLabel>{field.label}</ControlLabel>
        <FormControl {...constraints} type="number" placeholder={field.label} value={value} onChange={onChange}/>
        {validationState && <HelpBlock>{this.state.errors[field.fieldName]}</HelpBlock>}
      </FormGroup>);
    }

    else if(field.type == "webmap"){
      field.fieldName = "webmap";
      value = this.state.values.webmap;
      const onMapDataChanged = (mapData) => {
        this.setState({ mapData })
      }
      fieldEl =
        <FormGroup validationState={validationState}>
          <ControlLabel>{field.label}</ControlLabel>
          <WebMapPicker key="webMapPicker" value={value} onChange={onChange} onMapDataChanged={onMapDataChanged} portalHomeUrl={this.props.portalHomeUrl}/>
          {validationState && <HelpBlock>{this.state.errors[field.fieldName]}</HelpBlock>}
        </FormGroup>;
    }
    else if(field.type.toLowerCase() == "layerandfieldselector"){
      fieldEl = <LayerAndFieldSelector field={field} value={value} mapData={this.state.mapData} onChange={onChange}/>
    }
    else if(field.type.toLowerCase() == "multilayerandfieldselector"){
      fieldEl = <MultilayerAndFieldSelector field={field} value={value} mapData={this.state.mapData} onChange={onChange}/>
    }
    else if(field.type.toLowerCase() == "color"){
      fieldEl = <ColorPicker label={field.label} validationState={validationState} value={value} onChange={onChange}/>
    }
    else{
      fieldEl = <div className="well">
        {JSON.stringify(field)}
      </div>
    }
    // if(field.tooltip){
    //   const tooltip = (<Tooltip>{field.tooltip}</Tooltip>);
    //   return <OverlayTrigger placement="top" overlay={tooltip}>
    //     {fieldEl}
    //   </OverlayTrigger>
    // }
    return fieldEl;

  }
  save(){
    const defaultValues = Object.assign({} , this.state.configurationPanel.values);
    const config = Object.assign(defaultValues, this.state.values);
    console.log(config);
    var formData = new FormData();
    formData.append( "csrfmiddlewaretoken", this.props.csrfmiddlewaretoken );
    formData.append( "config", JSON.stringify( config ) );
    this.setState({saving: true});
    fetch("", {
      credentials: 'include',
      method: 'POST',
      body: formData
    })
    .then((response)=>response.json())
    .then((resJson) => {
      this.setState({saving: false});
      if(resJson.success){
        if(this.props.isNew) window.location = "../" + resJson.id + "/edit/";
      }
      else{
        this.setState({errors: resJson.errors})
      }
    });
  }
}

export default App;
global.App = App;
