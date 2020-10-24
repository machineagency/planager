import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import { WorkflowProvider } from './WorkflowContext'

ReactDOM.render( 
	<WorkflowProvider>
		<Main />
	</WorkflowProvider>,
	document.getElementById('root'));
