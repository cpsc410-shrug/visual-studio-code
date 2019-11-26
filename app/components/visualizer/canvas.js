import React from 'react';
import styled from 'styled-components';

import { network } from './network';
import { OptionsOverlay } from './overlay';

const StyledCanvas = styled.div`
    height: 100%;
    width: 100%;

    & div:focus,
    canvas:focus {
        outline: 0;
    }
`;
const VisualizerTitle = styled.div`
    background-color: white;
    border-color: black;
    border-radius: 0 0 15px 15px;
    border-style: solid;
    border-width: 0 2px 2px 2px;
    box-sizing: border-box;
    font-size: xx-large;
    padding: 0 0 5px 0;
    position: absolute;
    width: 30%;
    z-index: 5;
`;
const Visualizer = styled.div`
    align-items: center;
    border-color: black;
    border-width: 0 0 0 3px;
    border-style: solid;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-area: vis;
    height: 100%;
    position: relative;
`;

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentSelection: null,
            currentVisualization: "Dependencies",
            newNetwork: true,
            showOverlay: false
        }

        this.changeVisualization = this.changeVisualization.bind(this);
        this.clickOnNode = this.clickOnNode.bind(this);
        this.resetVisualization = this.resetVisualization.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
    }

    changeSelection(selection) {
        this.setState ({ currentSelection: selection });
    }

    changeVisualization(visualization) {
        this.setState ({ currentVisualization: visualization, newNetwork: true, showOverlay: false });
    }

    clickOnNode(name) {
        this.changeSelection(name);
        this.toggleOverlay();
    }
    
    componentDidUpdate(prevProps) {
        if (this.state.newNetwork || prevProps.url != this.props.url) {
            this.setState({ newNetwork: false });
            const { currentSelection } = this.state;
            const { currentVisualization } = this.state;
            network(this.props.id, this.clickOnNode, currentSelection, currentVisualization);
        }
    }

    resetVisualization(ev) {
        const { currentVisualization } = this.state;
        if (ev.key === "Escape" && currentVisualization != "Dependencies") {
            this.changeSelection(null);
            this.changeVisualization("Dependencies");
        }
    }

    toggleOverlay() {
        const { showOverlay } = this.state;
        this.setState({ showOverlay: !showOverlay });
    }
    
    render() {
        const { id, url } = this.props;
        const { showOverlay, currentSelection, currentVisualization } = this.state;

        return <Visualizer>
            <VisualizerTitle>{currentVisualization}</VisualizerTitle>
            <OptionsOverlay changeVisualization={this.changeVisualization}
                currentSelection={currentSelection}
                showOverlay={showOverlay} 
                toggleOverlay={this.toggleOverlay} />
            <StyledCanvas id={id} onKeyDown={this.resetVisualization} />
        </Visualizer>;
    }
}