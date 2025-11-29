// Central index for `src/components` - imports and re-exports each component
import AiAssistant from './AiAssistant.jsx'
import ControlPanel from './ControlPanel.jsx'
import LogPanel from './LogPanel.jsx'
import ScadaDiagram from './ScadaDiagram.jsx'

export { AiAssistant, ControlPanel, LogPanel, ScadaDiagram }

// Default export as a convenience object
export default {
  AiAssistant,
  ControlPanel,
  LogPanel,
  ScadaDiagram,
}
