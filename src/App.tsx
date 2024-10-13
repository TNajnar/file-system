import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchFileSystem } from './api/fetchFileSystem';
import { TFileSystem } from './api/apiTypes';
import { ERoutes } from './lib/enums';
import './styles/app.css';

function App(): React.ReactElement {
  const [fileSystemData, setFileSystemData] = React.useState<TFileSystem[] | undefined>(undefined);

  const location = useLocation();
  const navigate = useNavigate()

  function handleDirectoryClick(item: TFileSystem): void {
    if (item.isDirectory) {
      const newPath = `${location.pathname}/${item.name}`.replace(/\/+/g, ERoutes.Home);
      navigate(newPath);
    }
  };

  function handleBackClick(): void {
    const parts = location.pathname.split(ERoutes.Home).filter(part => part);
    if (parts.length > 0) {
      const newPath = ERoutes.Home + parts.slice(0, parts.length - 1).join(ERoutes.Home);
      navigate(newPath);
    }
  };
  
  React.useEffect(() => {
    (async (): Promise<void> => {
      const path = location.pathname === ERoutes.Home ? '' : location.pathname;
      const fileData = await fetchFileSystem(path);

      if (fileData) {
        setFileSystemData(fileData);
      }
    })();
  }, [location.pathname]);

  return (
    <main>
      <h1>Browsing: {location.pathname}</h1>

        <ul>
          {location.pathname !== ERoutes.Home &&
            <button onClick={handleBackClick}>..</button>
          }

          {fileSystemData?.length && fileSystemData.map((item) =>
            <li key={item.fullPath} onClick={(): void => handleDirectoryClick(item)}>
              {item.isDirectory ? '📁' : '📄'} {item.name}
            </li>
          )}
        </ul>
    </main>
  );
};

export default App;
