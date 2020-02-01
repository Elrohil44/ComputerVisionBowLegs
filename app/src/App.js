import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import BowLegAppContainer from './components/BowLegAppContainer';


// function App() {
//   return (
//     <div className="App">
//       <PredictionTable />
//     </div>
//   );
// }

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <BowLegAppContainer />
    </React.Fragment>
  );
}

export default App;
