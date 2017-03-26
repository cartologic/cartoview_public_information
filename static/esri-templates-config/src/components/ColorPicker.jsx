import React from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock, FieldGroup, OverlayTrigger, Button ,Popover } from 'react-bootstrap';
import { CompactPicker } from 'react-color';
import '../css/color-picker.css';

class ColorPicker extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      color: props.value
    };
    this.value  = props.value;
  }
  render(){
    const {validationState, label, error} = this.props;
    const onChange = (color) => {
      this.value = color.hex;
      this.setState({
        color: this.value
      })
      if(this.props.onChange) this.props.onChange({target: this});
    }

    const popover = (
      <Popover id="popover-trigger-click-root-close" className="color-picker-popover">
        <CompactPicker color={this.value} onChange={onChange} />
      </Popover>
    );
    const style = {
      backgroundColor: this.value
    }
    return <FormGroup validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
        <Button style={style} bsSize="lg" className="btn-color-picker"/>
      </OverlayTrigger>
      {validationState && <HelpBlock>{error}</HelpBlock>}
    </FormGroup>
  }
}
export default ColorPicker;


/*
import RCColorPicker from 'rc-color-picker';
import React from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock, FieldGroup } from 'react-bootstrap';
import 'rc-color-picker/assets/index.css';

class ColorPicker extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      color: props.value
    };
    Object.defineProperty(this, 'value', {
      get: () => { return this.state.color; },
      set: (val) => { this.setState({color: val }) }
    });
  }
  render(){
    const {validationState, label, error} = this.props;
    const onChange = (colors) => {
      console.log(colors);
      this.value = colors.color;
      if(this.props.onChange) this.props.onChange({target: this});
    }
    return <FormGroup validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <RCColorPicker color={this.value} onChange={onChange} />
      {validationState && <HelpBlock>{error}</HelpBlock>}
    </FormGroup>
  }
}
export default ColorPicker;




*/
