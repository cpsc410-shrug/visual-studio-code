import React from 'react';
import styled from 'styled-components';

import { Box } from '../form/box';
import { Button } from '../form/button';

const Description = styled.div`
    align-self: normal;
    display: flex;
    flex-direction: column;
    grid-area: lower;
    padding: 5px;
    text-align: left;

    & p {
        text-indent: 2em;
    }
`;
const Title = styled.p`
    font-size: xx-large;
    margin: 15px;
    user-select: none;
`;
const ToggleContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`;
const UpperContent = styled.div`
    grid-area: upper;
`;

const getRepoUrlFromSubmit = (ev, setUrl) => {
    ev.preventDefault();
    const formElements = ev.target.elements;
    const url = formElements.namedItem("repoUrl").value;
    console.log(url);
    setUrl(url);
};

const upperContent = (onSubmit) => {
    return <UpperContent>
        <Title>Visualize a Repository's Dependencies</Title>
        <form id="getGitRepo" onSubmit={onSubmit}>
            <Box id="repoUrl"/>
            <Button label="Visualize" form="getGitRepo"/>
        </form>
    </UpperContent>;
};

export const SidePanel = ({ setUrl, setVisualizer3D }) => {
    const form = upperContent((ev) => getRepoUrlFromSubmit(ev, setUrl));
    return <>
        {form}
        <Description>
            <p>Enter a Github repository URL and click submit. You will be greeted with a visualization of your repository's dependencies. Clicking on an individual node will allow you to visualize the following:</p>
            <ul>
                <li><strong>Upgrade Path:</strong> the most suitable sequence of upgrades for the given dependency such that other dependencies do not break.</li>
                <li><strong>Sub-Dependencies:</strong> the dependencies not directly installed by the developer, but that are required by the developer's chosen dependencies.</li>
                <li><strong>Dependency Integration:</strong> the level at which the files in the repository are integrated/use the various dependencies on the project.</li>
            </ul>
        </Description>
        <ToggleContainer>
            <label for="toggle3DVisualization">Toggle 3D Visualization</label>
            <input type="checkbox" id="toggle3DVisualization" onClick={(ev) => setVisualizer3D(ev.value)} />
        </ToggleContainer>
    </>;
}; 
