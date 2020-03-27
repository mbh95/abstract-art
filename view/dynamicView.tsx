import React, {ChangeEvent, Component} from 'react';
import Main from "./main";

interface DynamicViewProps {
    readonly initialSrc: string;
}

interface DynamicViewState {
    src: string;
}

class DynamicView extends Component<DynamicViewProps, DynamicViewState> {

    constructor(props: DynamicViewProps) {
        super(props);
        this.state = {
            src: this.props.initialSrc,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({src: event.target.value});
    }

    render() {
        return (
            <div>
                <Main src={this.state.src}/>
                <input type="text" value={this.state.src} onChange={this.handleChange}/>
            </div>
        );
    }
}

export default DynamicView;