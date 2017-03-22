import React from 'react';
import classNames from 'classnames';
import { FormGroup, FormControl, ControlLabel, HelpBlock, FieldGroup, Checkbox } from 'react-bootstrap';


class MultilayerAndFieldSelector extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selected: {}
    };
    Object.defineProperty(this, 'value', {
      get: () => {
        const values = Object.values(this.state.selected)
        return values.length > 0 ? values : undefined;
      },
      set: (val) => {
        var selected = {};
        if(val && val.length){
          val.forEach(layer => selected[layer.id]=layer);
        }
        this.setState({selected})
      }
    });
  }
  render(){
    const {validationState, field} = this.props;
    const onChange = (e, layer) =>{
      if(e.target.checked){
        this.state.selected[layer.id] = {
          id: layer.id,
          fields: []
        };
      }
      else{
        delete this.state.selected[layer.id];
      }
      this.props.onChange({target: this})
    }
    return <FormGroup validationState={validationState}>
      <ControlLabel>{field.label}</ControlLabel>
      {this.filterLayers(field).map((layer) =>  <Checkbox checked={this.state.selected.hasOwnProperty(layer.id)}
          onChange={(e) => onChange(e, layer)}>{layer.title}</Checkbox>)}
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
export default MultilayerAndFieldSelector;
