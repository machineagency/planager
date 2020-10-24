import React from 'react'

const WorkflowContext = React.createContext()

export const WorkflowProvider = WorkflowContext.Provider
export const WorkflowConsumer = WorkflowContext.Consumer

export default WorkflowContext