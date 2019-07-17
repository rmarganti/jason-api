import * as React from 'react';

import HocsArticle from './components/hocs/Article';
import HooksArticle from './components/hooks/Article';

import { useToggle } from './hooks';

const App: React.SFC = () => {
    const [showHooks, toggleShowHooks] = useToggle(true);

    return (
        <>
            <button onClick={toggleShowHooks}>
                {showHooks ? "HOC's" : 'Hooks'}
            </button>

            {showHooks ? <HooksArticle id="1" /> : <HocsArticle id="1" />}
        </>
    );
};

export default App;
