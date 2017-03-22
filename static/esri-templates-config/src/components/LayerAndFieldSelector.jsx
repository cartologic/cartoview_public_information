import React from 'react';
import classNames from 'classnames';
import { FormGroup, FormControl, ControlLabel, HelpBlock, FieldGroup } from 'react-bootstrap';


class LayerAndFieldSelector extends React.Component{
  render(){
    const {validationState, field} = this.props;
    const onChange = (e) =>{
      if(e.target.value == "-1"){
        delete this.value;
      }
      else{
        this.value = {
          id: e.target.value,
          fields: []
        };
      }
      this.props.onChange({target: this})
    }
    var value;
    if(this.value) value = this.value.id;
    return <FormGroup validationState={validationState}>
      <ControlLabel>{field.label}</ControlLabel>
      <FormControl componentClass="select" placeholder={field.label} value={value}  onChange={onChange}>
        <option value="-1">Select Layer</option>
        {this.filterLayers(field).map(o => <option value={o.id}>{o.title}</option>)}
      </FormControl>
      {validationState && <HelpBlock>{this.state.errors[field.fieldName]}</HelpBlock>}
    </FormGroup>
  }
  operationalLayers(){
    if(this.props.mapData && this.props.mapData.data){
      return this.props.mapData.data.operationalLayers || [];
    }
    return [];
  }
  filterLayers(field){
    return this.operationalLayers();
  }
}
export default LayerAndFieldSelector;
